package com.medstudy.backend.modules.flashcard.repository;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, UUID>, JpaSpecificationExecutor<Flashcard> {
    Page<Flashcard> findAllByUserId(UUID userId, Pageable pageable);
    java.util.List<Flashcard> findAllByUserId(UUID userId);
    
    long countByUserIdAndProximaRevisaoBefore(UUID userId, LocalDate date);
    long countByUserIdAndProximaRevisao(UUID userId, LocalDate date);
    long countByUserIdAndProximaRevisaoAfter(UUID userId, LocalDate date);
    long countByUserIdAndLastStudiedAt(UUID userId, LocalDate date);

    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true)
    @org.springframework.data.jpa.repository.Query("UPDATE Flashcard f SET f.intervaloAtual = 0, f.easeFactor = 2.5, f.proximaRevisao = CURRENT_DATE, f.consecutiveHardCount = 0 WHERE f.user.id = :userId AND (:grandeArea IS NULL OR f.grandeArea = :grandeArea)")
    void resetProgress(@org.springframework.data.repository.query.Param("userId") UUID userId, @org.springframework.data.repository.query.Param("grandeArea") String grandeArea);
}
