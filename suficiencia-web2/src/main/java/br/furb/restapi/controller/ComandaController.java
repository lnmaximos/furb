package br.furb.restapi.controller;

import br.furb.restapi.dao.ComandaRepository;
import br.furb.restapi.dto.ComandaCreateDto;
import br.furb.restapi.dto.ComandaUpdateDto;
import br.furb.restapi.model.Comanda;
import br.furb.restapi.model.Produto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comandas")
public class ComandaController {

    private final ComandaRepository repository;

    public ComandaController(ComandaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Comanda> getAllComandas() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Comanda getComandaById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comanda não encontrada"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Comanda createComanda(@Valid @RequestBody ComandaCreateDto comandaDto) {
        Comanda novaComanda = new Comanda();
        novaComanda.setIdUsuario(comandaDto.getIdUsuario());
        novaComanda.setNomeUsuario(comandaDto.getNomeUsuario());
        novaComanda.setTelefoneUsuario(comandaDto.getTelefoneUsuario());

        List<Produto> produtosEntidade = new ArrayList<>();
        if (comandaDto.getProdutos() != null) {
            for (var produtoDto : comandaDto.getProdutos()) {
                Produto novoProduto = new Produto();
                novoProduto.setNome(produtoDto.getNome());
                novoProduto.setPreco(produtoDto.getPreco());
                novoProduto.setComanda(novaComanda);
                produtosEntidade.add(novoProduto);
            }
        }
        novaComanda.setProdutos(produtosEntidade);

        return repository.save(novaComanda);
    }

    @PutMapping("/{id}")
    public Comanda updateComanda(@PathVariable Long id, @Valid @RequestBody ComandaUpdateDto comandaDto) {
        Comanda comandaExistente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comanda não encontrada"));

        if (comandaDto.getIdUsuario() != null) {
            comandaExistente.setIdUsuario(comandaDto.getIdUsuario());
        }
        if (comandaDto.getNomeUsuario() != null) {
            comandaExistente.setNomeUsuario(comandaDto.getNomeUsuario());
        }
        if (comandaDto.getTelefoneUsuario() != null) {
            comandaExistente.setTelefoneUsuario(comandaDto.getTelefoneUsuario());
        }
        if (comandaDto.getProdutos() != null && !comandaDto.getProdutos().isEmpty()) {
            for(var produtoDto : comandaDto.getProdutos()) {
                Produto p = new Produto();
                p.setNome(produtoDto.getNome());
                p.setPreco(produtoDto.getPreco());
                p.setComanda(comandaExistente);
                comandaExistente.getProdutos().add(p);
            }
        }
        return repository.save(comandaExistente);
    }

    @DeleteMapping("/{id}")
    public Map<String, Map<String, String>> deleteComanda(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comanda não encontrada");
        }
        repository.deleteById(id);
        return Collections.singletonMap("success", Collections.singletonMap("text", "comanda removida"));
    }
}