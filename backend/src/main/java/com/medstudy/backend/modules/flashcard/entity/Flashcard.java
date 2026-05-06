package com.medstudy.backend.modules.flashcard.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.Map;

@Entity
@Table(name = "flashcards")
public class Flashcard extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "grande_area", nullable = false, length = 100)
    private String grandeArea;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> frente;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> verso;

    @Column(name = "proxima_revisao")
    private LocalDate proximaRevisao;

    @Column(name = "dificuldade_ultima", length = 50)
    private String dificuldadeUltima;

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getGrandeArea() { return grandeArea; }
    public void setGrandeArea(String grandeArea) { this.grandeArea = grandeArea; }
    public Map<String, Object> getFrente() { return frente; }
    public void setFrente(Map<String, Object> frente) { this.frente = frente; }
    public Map<String, Object> getVerso() { return verso; }
    public void setVerso(Map<String, Object> verso) { this.verso = verso; }
    public LocalDate getProximaRevisao() { return proximaRevisao; }
    public void setProximaRevisao(LocalDate proximaRevisao) { this.proximaRevisao = proximaRevisao; }
    public String getDificuldadeUltima() { return dificuldadeUltima; }
    public void setDificuldadeUltima(String dificuldadeUltima) { this.dificuldadeUltima = dificuldadeUltima; }
}
