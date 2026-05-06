package com.medstudy.backend.modules.simulado.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "simulados")
public class Simulado extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String nome;

    @Column(name = "data_realizacao", nullable = false)
    private LocalDate dataRealizacao;

    // Clínica Médica
    @Column(name = "cm_total", nullable = false)
    private Integer cmTotal = 0;
    @Column(name = "cm_acertos", nullable = false)
    private Integer cmAcertos = 0;
    @Column(name = "cm_erros", nullable = false)
    private Integer cmErros = 0;

    // Cirurgia
    @Column(name = "cir_total", nullable = false)
    private Integer cirTotal = 0;
    @Column(name = "cir_acertos", nullable = false)
    private Integer cirAcertos = 0;
    @Column(name = "cir_erros", nullable = false)
    private Integer cirErros = 0;

    // Pediatria
    @Column(name = "ped_total", nullable = false)
    private Integer pedTotal = 0;
    @Column(name = "ped_acertos", nullable = false)
    private Integer pedAcertos = 0;
    @Column(name = "ped_erros", nullable = false)
    private Integer pedErros = 0;

    // GO
    @Column(name = "go_total", nullable = false)
    private Integer goTotal = 0;
    @Column(name = "go_acertos", nullable = false)
    private Integer goAcertos = 0;
    @Column(name = "go_erros", nullable = false)
    private Integer goErros = 0;

    // Preventiva
    @Column(name = "prev_total", nullable = false)
    private Integer prevTotal = 0;
    @Column(name = "prev_acertos", nullable = false)
    private Integer prevAcertos = 0;
    @Column(name = "prev_erros", nullable = false)
    private Integer prevErros = 0;

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public LocalDate getDataRealizacao() { return dataRealizacao; }
    public void setDataRealizacao(LocalDate dataRealizacao) { this.dataRealizacao = dataRealizacao; }
    public Integer getCmTotal() { return cmTotal; }
    public void setCmTotal(Integer cmTotal) { this.cmTotal = cmTotal; }
    public Integer getCmAcertos() { return cmAcertos; }
    public void setCmAcertos(Integer cmAcertos) { this.cmAcertos = cmAcertos; }
    public Integer getCmErros() { return cmErros; }
    public void setCmErros(Integer cmErros) { this.cmErros = cmErros; }
    public Integer getCirTotal() { return cirTotal; }
    public void setCirTotal(Integer cirTotal) { this.cirTotal = cirTotal; }
    public Integer getCirAcertos() { return cirAcertos; }
    public void setCirAcertos(Integer cirAcertos) { this.cirAcertos = cirAcertos; }
    public Integer getCirErros() { return cirErros; }
    public void setCirErros(Integer cirErros) { this.cirErros = cirErros; }
    public Integer getPedTotal() { return pedTotal; }
    public void setPedTotal(Integer pedTotal) { this.pedTotal = pedTotal; }
    public Integer getPedAcertos() { return pedAcertos; }
    public void setPedAcertos(Integer pedAcertos) { this.pedAcertos = pedAcertos; }
    public Integer getPedErros() { return pedErros; }
    public void setPedErros(Integer pedErros) { this.pedErros = pedErros; }
    public Integer getGoTotal() { return goTotal; }
    public void setGoTotal(Integer goTotal) { this.goTotal = goTotal; }
    public Integer getGoAcertos() { return goAcertos; }
    public void setGoAcertos(Integer goAcertos) { this.goAcertos = goAcertos; }
    public Integer getGoErros() { return goErros; }
    public void setGoErros(Integer goErros) { this.goErros = goErros; }
    public Integer getPrevTotal() { return prevTotal; }
    public void setPrevTotal(Integer prevTotal) { this.prevTotal = prevTotal; }
    public Integer getPrevAcertos() { return prevAcertos; }
    public void setPrevAcertos(Integer prevAcertos) { this.prevAcertos = prevAcertos; }
    public Integer getPrevErros() { return prevErros; }
    public void setPrevErros(Integer prevErros) { this.prevErros = prevErros; }
}
