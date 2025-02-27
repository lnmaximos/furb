const apiUrl = 'https://jsonplaceholder.typicode.com/photos';
const itensPorPagina = 10;
let currentPage = 1;
let modoEdicao = false;

async function carregarFotosIniciais() {
    let fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    if (fotos.length === 0) {
        const response = await fetch(`${apiUrl}?_start=0&_limit=100`);
        fotos = await response.json();
        localStorage.setItem('fotos', JSON.stringify(fotos));
    }
    return fotos;
}

function atualizarTabela(page = 1) {
    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    const fotosExcluidas = JSON.parse(localStorage.getItem('fotosExcluidas')) || [];
    
    const fotosFiltradas = fotos.filter(foto => !fotosExcluidas.includes(foto.id));
    const inicio = (page - 1) * itensPorPagina;
    const fotosPagina = fotosFiltradas.slice(inicio, inicio + itensPorPagina);

    const tabelaBody = document.getElementById('tabelaBody');
    tabelaBody.innerHTML = '';
    
    fotosPagina.forEach(foto => {
        tabelaBody.innerHTML += `
            <tr data-id="${foto.id}">
                <td>${foto.id}</td>
                <td ${modoEdicao ? 'contenteditable="true" class="editable"' : ''}>${foto.title}</td>
                <td><img src="${foto.thumbnailUrl}" alt="${foto.title}" width="50"></td>
            </tr>`;
    });
}

async function carregarMaisFotos() {
    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    const offset = fotos.length;

    const response = await fetch(`${apiUrl}?_start=${offset}&_limit=100`);
    const novasFotos = await response.json();

    const fotosAtualizadas = [...fotos, ...novasFotos];
    localStorage.setItem('fotos', JSON.stringify(fotosAtualizadas));
}

async function mudarPagina(direcao) {
    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    const fotosExcluidas = JSON.parse(localStorage.getItem('fotosExcluidas')) || [];
    const totalFotos = fotos.filter(foto => !fotosExcluidas.includes(foto.id)).length;

    const novaPagina = currentPage + direcao;
    if (novaPagina < 1 || (novaPagina - 1) * itensPorPagina >= totalFotos) return;

    currentPage = novaPagina;
    atualizarTabela(currentPage);

    if ((currentPage * itensPorPagina) >= fotos.length) {
        await carregarMaisFotos();
        atualizarTabela(currentPage);
    }
}

function converterImagemParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

async function inserirFoto(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const imageFile = document.getElementById('image').files[0];
    
    if (!title || (url && imageFile) || (!url && !imageFile)) {
        alert('Por favor, insira uma imagem.');
        return;
    }

    let imageUrl = url;
    if (imageFile) {
        try {
            imageUrl = await converterImagemParaBase64(imageFile);
        } catch (error) {
            alert('Erro ao processar a imagem.');
            return;
        }
    }

    const novoItem = {
        id: crypto.randomUUID(),
        title,
        thumbnailUrl: imageUrl
    };

    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    fotos.unshift(novoItem);
    localStorage.setItem('fotos', JSON.stringify(fotos));

    atualizarTabela(currentPage);

    document.getElementById('inserirForm').reset();
    alert('Item inserido com sucesso!');
}

function excluirFoto(event) {
    event.preventDefault();
    const id = document.getElementById('deleteId').value.trim();

    if (!id) {
        alert('Informe um código válido para excluir!');
        return;
    }

    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    const fotosExcluidas = JSON.parse(localStorage.getItem('fotosExcluidas')) || [];

    const idNumerico = !isNaN(id) && id.trim() !== '';

    const idFormatado = idNumerico ? parseInt(id) : id;

    const fotoExistente = fotos.some(foto => foto.id === idFormatado);

    if (!fotoExistente) {
        alert('O ID informado não existe!');
        return;
    }

    localStorage.setItem('fotos', JSON.stringify(fotos.filter(foto => foto.id !== idFormatado)));
    fotosExcluidas.push(idFormatado);
    localStorage.setItem('fotosExcluidas', JSON.stringify(fotosExcluidas));

    atualizarTabela(currentPage);
    document.getElementById('excluirForm').reset();
    alert('Item excluído com sucesso!');
}

function alternarModoEdicao() {
    modoEdicao = !modoEdicao;
    document.getElementById('btnAlterar').textContent = modoEdicao ? 'Sair do modo de alteração' : 'Entrar no modo de alteração';
    atualizarTabela(currentPage);
}

document.getElementById('tabelaBody').addEventListener('input', (e) => {
    const row = e.target.closest('tr');

    const id = row.getAttribute('data-id');

    const idNumerico = !isNaN(id) && id.trim() !== '';
    const idFormatado = idNumerico ? parseInt(id) : id;

    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];

    const index = fotos.findIndex(foto => foto.id === idFormatado);
    if (index !== -1) {
        fotos[index].title = e.target.textContent;
        localStorage.setItem('fotos', JSON.stringify(fotos));
    }
});

document.getElementById('inserirForm').addEventListener('submit', inserirFoto);
document.getElementById('excluirForm').addEventListener('submit', excluirFoto);
document.getElementById('btnAnterior').addEventListener('click', () => mudarPagina(-1));
document.getElementById('btnProximo').addEventListener('click', () => mudarPagina(1));
document.getElementById('btnAlterar').addEventListener('click', alternarModoEdicao);

carregarFotosIniciais().then(() => atualizarTabela());