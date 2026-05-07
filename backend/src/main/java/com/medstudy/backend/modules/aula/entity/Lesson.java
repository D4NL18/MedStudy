package com.medstudy.backend.modules.aula.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lessons")
public class Lesson extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "grande_area", nullable = false, length = 100)
    private String grandeArea;

    @Column(nullable = false)
    private String tema;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private LessonPriority prioridade;

    @Column(name = "aula_assistida", nullable = false)
    private Boolean aulaAssistida = false;

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getGrandeArea() { return grandeArea; }
    public void setGrandeArea(String grandeArea) { this.grandeArea = grandeArea; }
    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }
    public LessonPriority getPrioridade() { return prioridade; }
    public void setPrioridade(LessonPriority prioridade) { this.prioridade = prioridade; }
    public Boolean getAulaAssistida() { return aulaAssistida; }
    public void setAulaAssistida(Boolean aulaAssistida) { this.aulaAssistida = aulaAssistida; }
}
