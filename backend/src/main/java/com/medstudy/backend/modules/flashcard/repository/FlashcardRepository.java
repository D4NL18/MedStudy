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
    
    long countByUserIdAndProximaRevisaoLessThanEqual(UUID userId, LocalDate date);
}
