package com.medstudy.backend.modules.flashcard.entity;

import com.medstudy.backend.core.util.StringNormalizer;
import com.fasterxml.jackson.databind.JsonNode;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "flashcards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "grande_area", nullable = false)
    private String grandeArea;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "frente", nullable = false)
    private JsonNode frente;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "verso", nullable = false)
    private JsonNode verso;

    @Column(name = "proxima_revisao", nullable = false)
    private LocalDate proximaRevisao;

    @Enumerated(EnumType.STRING)
    @Column(name = "dificuldade_ultima")
    private FlashcardDifficulty dificuldadeUltima;

    @Column(name = "ease_factor")
    private Double easeFactor;

    @Column(name = "intervalo_atual")
    private Integer intervaloAtual;

    @Column(name = "consecutive_hard_count", nullable = false)
    private Integer consecutiveHardCount = 0;

    @Column(name = "last_studied_at")
    private LocalDate lastStudiedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
        if (easeFactor == null) easeFactor = 2.5;
        if (intervaloAtual == null) intervaloAtual = 0;
        if (proximaRevisao == null) proximaRevisao = LocalDate.now();
        this.grandeArea = StringNormalizer.normalize(this.grandeArea);
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
        this.grandeArea = StringNormalizer.normalize(this.grandeArea);
    }
}
