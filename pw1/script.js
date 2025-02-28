// Alterações feitas após a apresentação ao professor:
// Adicionadas requisições POST, DELETE e PATCH nas funções inserirFoto, excluirFoto e no EventListener do elemento tabelaBody, respectivamente
// Antes eu pegava os registros da API de 100 em 100, agora eu pego todos de uma vez
// Antes os IDs dos novos itens eram setados com UUIDs, mas agora, como estou interagindo com a API, passei a calculá-los como o último ID + 1 (por isso que eu parei de pegar os registros de 100 em 100 e passei a chamar todos de uma vez)
// Obs: A API seta os IDs de todos os novos itens como 5001. Eu estou calculando o ID por aqui e enviando ele na requisição mesmo assim para que, se inserirmos vários novos itens através da página, eles não fiquem todos com o mesmo ID na tabela de visualização
// Obs: Por mais que os novos itens tenham os maiores IDs, eles continuam aparecendo no começo da tabela para conseguirmos ver as inserções realizadas)

const apiUrl = 'https://jsonplaceholder.typicode.com/photos';
const itensPorPagina = 10;
let currentPage = 1;
let modoEdicao = false;

async function carregarFotosIniciais() {
    let fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    if (fotos.length === 0) {
        const response = await fetch(`${apiUrl}`);
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
async function mudarPagina(direcao) {
    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    const fotosExcluidas = JSON.parse(localStorage.getItem('fotosExcluidas')) || [];
    const totalFotos = fotos.filter(foto => !fotosExcluidas.includes(foto.id)).length;

    const novaPagina = currentPage + direcao;
    if (novaPagina < 1 || (novaPagina - 1) * itensPorPagina >= totalFotos) return;

    currentPage = novaPagina;
    atualizarTabela(currentPage);
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

    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];

    const ultimoId = fotos.length > 0 ? Math.max(...fotos.map(foto => foto.id)) : 5000;
    const novoId = ultimoId + 1;

    const novoItem = {
        albumId: 1,
        id: novoId,
        title,
        url: imageUrl,
        thumbnailUrl: imageUrl
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoItem)
        });

        if (!response.ok) throw new Error('Erro ao inserir registro na API.');

        fotos.unshift(novoItem);
        localStorage.setItem('fotos', JSON.stringify(fotos));
    
        atualizarTabela(currentPage);
    
        document.getElementById('inserirForm').reset();
        alert('Item inserido com sucesso!');
    } catch (error) {
        alert('Erro ao inserir registro na API e no localStorage.')
    }
}

async function excluirFoto(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('deleteId').value.trim());

    if (!id) {
        alert('Informe um código válido para excluir!');
        return;
    }

    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];

    const fotoExistente = fotos.some(foto => foto.id === id);
    
    if (!fotoExistente) {
        alert('O ID informado não existe!');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao excluir registro na API.');
    
        localStorage.setItem('fotos', JSON.stringify(fotos.filter(foto => foto.id !== id)));
    
        atualizarTabela(currentPage);
        document.getElementById('excluirForm').reset();
        alert('Item excluído com sucesso!');
    } catch (error) {
        alert('Erro ao excluir registro da API e do localStorage.');
    }
}

function alternarModoEdicao() {
    modoEdicao = !modoEdicao;
    document.getElementById('btnAlterar').textContent = modoEdicao ? 'Sair do modo de alteração' : 'Entrar no modo de alteração';
    atualizarTabela(currentPage);
}

document.getElementById('tabelaBody').addEventListener('input', async (e) => {
    const row = e.target.closest('tr');
    const id = parseInt(row.getAttribute('data-id'));

    const fotos = JSON.parse(localStorage.getItem('fotos')) || [];
    const index = fotos.findIndex(foto => foto.id === id);

    if (index !== -1) {
        fotos[index].title = e.target.textContent;
        localStorage.setItem('fotos', JSON.stringify(fotos));

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PATCH', // Eu só altero o título, por isso PATCH
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: fotos[index].title })
            });

            if (!response.ok) {
                throw new Error('Erro ao alterar o registro na API.');
            }

            console.log(`Título do registro ${id} atualizado com sucesso na API.`);
        } catch (error) {
            alert('Erro ao alterar o registro na API e no localStorage.')
        }
    }
});

document.getElementById('inserirForm').addEventListener('submit', inserirFoto);
document.getElementById('excluirForm').addEventListener('submit', excluirFoto);
document.getElementById('btnAnterior').addEventListener('click', () => mudarPagina(-1));
document.getElementById('btnProximo').addEventListener('click', () => mudarPagina(1));
document.getElementById('btnAlterar').addEventListener('click', alternarModoEdicao);

carregarFotosIniciais().then(() => atualizarTabela());