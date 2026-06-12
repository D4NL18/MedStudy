package com.medstudy.backend.modules.flashcard.repository;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for managing Flashcard entities.
 */
@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, UUID>, JpaSpecificationExecutor<Flashcard> {

    /**
     * Finds a paginated list of flashcards by user ID.
     *
     * @param userId the user ID
     * @param pageable pagination information
     * @return a page of flashcards
     */
    Page<Flashcard> findAllByUserId(UUID userId, Pageable pageable);

    /**
     * Finds a list of all flashcards by user ID.
     *
     * @param userId the user ID
     * @return a list of flashcards
     */
    List<Flashcard> findAllByUserId(UUID userId);
    
    /**
     * Counts the number of flashcards scheduled before a certain date for a user.
     *
     * @param userId the user ID
     * @param date the date to compare against
     * @return the count of flashcards
     */
    long countByUserIdAndProximaRevisaoBefore(UUID userId, LocalDate date);

    /**
     * Counts the number of flashcards scheduled exactly on a certain date for a user.
     *
     * @param userId the user ID
     * @param date the date to compare against
     * @return the count of flashcards
     */
    long countByUserIdAndProximaRevisao(UUID userId, LocalDate date);

    /**
     * Counts the number of flashcards scheduled after a certain date for a user.
     *
     * @param userId the user ID
     * @param date the date to compare against
     * @return the count of flashcards
     */
    long countByUserIdAndProximaRevisaoAfter(UUID userId, LocalDate date);

    /**
     * Counts the number of flashcards studied on a certain date for a user.
     *
     * @param userId the user ID
     * @param date the date to compare against
     * @return the count of flashcards
     */
    long countByUserIdAndLastStudiedAt(UUID userId, LocalDate date);

    /**
     * Counts the total number of flashcards for a user.
     *
     * @param userId the user ID
     * @return the total count of flashcards
     */
    long countByUserId(UUID userId);

    /**
     * Resets the spaced repetition progress of flashcards for a user, optionally filtered by subject area.
     *
     * @param userId the user ID
     * @param grandeArea the subject area to filter by, or null for all
     */
    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true)
    @org.springframework.data.jpa.repository.Query("UPDATE Flashcard f SET f.intervaloAtual = 0, f.easeFactor = 2.5, f.proximaRevisao = CURRENT_DATE, f.consecutiveHardCount = 0 WHERE f.user.id = :userId AND (:grandeArea IS NULL OR f.grandeArea = :grandeArea)")
    void resetProgress(@org.springframework.data.repository.query.Param("userId") UUID userId, @org.springframework.data.repository.query.Param("grandeArea") String grandeArea);
}
