package com.medstudy.backend.modules.sessao.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.core.util.StringNormalizer;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import org.hibernate.annotations.Formula;

import java.time.LocalDate;

@Entity
@Table(name = "study_sessions")
public class StudySession extends BaseEntity {

    @PrePersist
    @PreUpdate
    public void normalizeData() {
        this.grandeArea = StringNormalizer.normalize(this.grandeArea);
        this.tema = StringNormalizer.normalize(this.tema);
        this.instituicao = StringNormalizer.normalize(this.instituicao);
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "grande_area", nullable = false, length = 100)
    private String grandeArea;

    @Column(nullable = false)
    private String tema;

    @Column(name = "data_sessao", nullable = false)
    private LocalDate dataSessao;

    @Column(name = "qts_feitas", nullable = false)
    private Integer qtsFeitas = 0;

    @Column(name = "qts_corretas", nullable = false)
    private Integer qtsCorretas = 0;

    @Column
    private String instituicao;

    @Column(name = "data_proxima_revisao")
    private LocalDate dataProximaRevisao;

    @Column(name = "revisao_concluida", nullable = false)
    private Boolean revisaoConcluida = false;

    @Column(name = "urgente", nullable = false)
    private Boolean urgente = false;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Formula("CASE WHEN qts_feitas > 0 THEN (CAST(qts_corretas AS float) / qts_feitas) * 100 ELSE 0 END")
    private Double performance;

    // Getters and Setters
    public Double getPerformance() {
        return performance;
    }

    public void setPerformance(Double performance) {
        this.performance = performance;
    }
    public Boolean getUrgente() {
        return urgente;
    }

    public void setUrgente(Boolean urgente) {
        this.urgente = urgente;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getGrandeArea() {
        return grandeArea;
    }

    public void setGrandeArea(String grandeArea) {
        this.grandeArea = grandeArea;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public LocalDate getDataSessao() {
        return dataSessao;
    }

    public void setDataSessao(LocalDate dataSessao) {
        this.dataSessao = dataSessao;
    }

    public Integer getQtsFeitas() {
        return qtsFeitas;
    }

    public void setQtsFeitas(Integer qtsFeitas) {
        this.qtsFeitas = qtsFeitas;
    }

    public Integer getQtsCorretas() {
        return qtsCorretas;
    }

    public void setQtsCorretas(Integer qtsCorretas) {
        this.qtsCorretas = qtsCorretas;
    }

    public String getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(String instituicao) {
        this.instituicao = instituicao;
    }

    public LocalDate getDataProximaRevisao() {
        return dataProximaRevisao;
    }

    public void setDataProximaRevisao(LocalDate dataProximaRevisao) {
        this.dataProximaRevisao = dataProximaRevisao;
    }

    public Boolean getRevisaoConcluida() {
        return revisaoConcluida;
    }

    public void setRevisaoConcluida(Boolean revisaoConcluida) {
        this.revisaoConcluida = revisaoConcluida;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
