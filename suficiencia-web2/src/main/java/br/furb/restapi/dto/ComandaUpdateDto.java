package br.furb.restapi.dto;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;

public class ComandaUpdateDto {

    private Long idUsuario;
    private String nomeUsuario;
    private String telefoneUsuario;

    @Valid
    private List<ProdutoCreateDto> produtos = new ArrayList<>();

    public Long getIdUsuario() {
        return idUsuario;
    }
    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }
    public String getNomeUsuario() {
        return nomeUsuario;
    }
    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }
    public String getTelefoneUsuario() {
        return telefoneUsuario;
    }
    public void setTelefoneUsuario(String telefoneUsuario) {
        this.telefoneUsuario = telefoneUsuario;
    }
    public List<ProdutoCreateDto> getProdutos() {
        return produtos;
    }
    public void setProdutos(List<ProdutoCreateDto> produtos) {
        this.produtos = produtos;
    }
}