package br.furb.restapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ProdutoCreateDto {

    @NotBlank(message = "O nome do produto é obrigatório")
    private String nome;

    @NotNull(message = "O preço do produto é obrigatório")
    @Positive(message = "O preço deve ser um valor positivo")
    private BigDecimal preco;

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public BigDecimal getPreco() {
        return preco;
    }
    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
}