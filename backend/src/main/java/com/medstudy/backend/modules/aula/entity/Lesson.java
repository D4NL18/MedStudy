package com.medstudy.backend.modules.aula.entity;

import java.time.LocalDate;
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

/**
 * Entity representing a Lesson.
 */
@Entity
@Table(name = "lessons")
public class Lesson extends BaseEntity {

    /**
     * The user associated with this lesson.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * The major area of the lesson.
     */
    @Column(name = "grande_area", nullable = false, length = 100)
    private String grandeArea;

    /**
     * The theme or topic of the lesson.
     */
    @Column(nullable = false)
    private String tema;

    /**
     * The priority of the lesson.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private LessonPriority prioridade;

    /**
     * Indicates whether the lesson has been watched.
     */
    @Column(name = "aula_assistida", nullable = false)
    private Boolean aulaAssistida = false;

    /**
     * The sub-area of the lesson.
     */
    @Column(name = "sub_area")
    private String subArea;

    /**
     * The date of the lesson.
     */
    @Column(name = "data_aula")
    private LocalDate dataAula;

    /**
     * The accuracy percentage.
     */
    @Column(name = "percent_acerto")
    private Integer percentAcerto;

    /**
     * Indicates whether reinforcement is required.
     */
    @Column(nullable = false)
    private Boolean reforco = false;

    /**
     * Indicates whether a review is required or completed.
     */
    @Column(nullable = false)
    private Boolean revisao = false;

    /**
     * Gets the user.
     * @return the user
     */
    public User getUser() { return user; }

    /**
     * Sets the user.
     * @param user the user
     */
    public void setUser(User user) { this.user = user; }

    /**
     * Gets the major area.
     * @return the major area
     */
    public String getGrandeArea() { return grandeArea; }

    /**
     * Sets the major area.
     * @param grandeArea the major area
     */
    public void setGrandeArea(String grandeArea) { this.grandeArea = grandeArea; }

    /**
     * Gets the sub-area.
     * @return the sub-area
     */
    public String getSubArea() { return subArea; }

    /**
     * Sets the sub-area.
     * @param subArea the sub-area
     */
    public void setSubArea(String subArea) { this.subArea = subArea; }

    /**
     * Gets the theme.
     * @return the theme
     */
    public String getTema() { return tema; }

    /**
     * Sets the theme.
     * @param tema the theme
     */
    public void setTema(String tema) { this.tema = tema; }

    /**
     * Gets the lesson priority.
     * @return the lesson priority
     */
    public LessonPriority getPrioridade() { return prioridade; }

    /**
     * Sets the lesson priority.
     * @param prioridade the priority
     */
    public void setPrioridade(LessonPriority prioridade) { this.prioridade = prioridade; }

    /**
     * Gets whether the lesson was watched.
     * @return true if watched, false otherwise
     */
    public Boolean getAulaAssistida() { return aulaAssistida; }

    /**
     * Sets whether the lesson was watched.
     * @param aulaAssistida the watched status
     */
    public void setAulaAssistida(Boolean aulaAssistida) { this.aulaAssistida = aulaAssistida; }

    /**
     * Gets the lesson date.
     * @return the date
     */
    public LocalDate getDataAula() { return dataAula; }

    /**
     * Sets the lesson date.
     * @param dataAula the date
     */
    public void setDataAula(LocalDate dataAula) { this.dataAula = dataAula; }

    /**
     * Gets the accuracy percentage.
     * @return the percentage
     */
    public Integer getPercentAcerto() { return percentAcerto; }

    /**
     * Sets the accuracy percentage.
     * @param percentAcerto the percentage
     */
    public void setPercentAcerto(Integer percentAcerto) { this.percentAcerto = percentAcerto; }

    /**
     * Gets whether reinforcement is needed.
     * @return true if needed
     */
    public Boolean getReforco() { return reforco; }

    /**
     * Sets whether reinforcement is needed.
     * @param reforco the reinforcement status
     */
    public void setReforco(Boolean reforco) { this.reforco = reforco; }

    /**
     * Gets whether a review is needed.
     * @return true if needed
     */
    public Boolean getRevisao() { return revisao; }

    /**
     * Sets whether a review is needed.
     * @param revisao the review status
     */
    public void setRevisao(Boolean revisao) { this.revisao = revisao; }
}
