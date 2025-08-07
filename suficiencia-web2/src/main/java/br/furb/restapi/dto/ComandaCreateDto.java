package br.furb.restapi.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class ComandaCreateDto {

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long idUsuario;

    @NotBlank(message = "O nome do usuário é obrigatório")
    private String nomeUsuario;

    @NotBlank(message = "O telefone do usuário é obrigatório")
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