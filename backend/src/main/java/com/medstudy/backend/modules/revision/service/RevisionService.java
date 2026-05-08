package com.medstudy.backend.modules.revision.service;

import com.medstudy.backend.modules.revision.dto.RevisionSummaryResponse;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.mapper.StudySessionMapper;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RevisionService {

    private final StudySessionRepository sessionRepository;
    private final com.medstudy.backend.modules.flashcard.repository.FlashcardRepository flashcardRepository;
    private final StudySessionMapper mapper;

    @Transactional(readOnly = true)
    public RevisionSummaryResponse getSummary() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();

        // Study Sessions
        long sessionsAtrasadas = sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(userId, today);
        long sessionsHoje = sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(userId, today);
        long sessionsFuturas = sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(userId, today);
        long sessionsConcluidas = sessionRepository.countByUserIdAndRevisaoConcluidaTrue(userId);

        // Flashcards
        long flashcardsAtrasados = flashcardRepository.countByUserIdAndProximaRevisaoBefore(userId, today);
        long flashcardsHoje = flashcardRepository.countByUserIdAndProximaRevisao(userId, today);
        long flashcardsFuturos = flashcardRepository.countByUserIdAndProximaRevisaoAfter(userId, today);
        long flashcardsConcluidos = flashcardRepository.countByUserIdAndLastStudiedAt(userId, today);

        return new RevisionSummaryResponse(
            sessionsAtrasadas + flashcardsAtrasados,
            sessionsHoje + flashcardsHoje,
            sessionsFuturas + flashcardsFuturos,
            sessionsConcluidas + flashcardsConcluidos
        );
    }

    // Listing methods will be added as needed, or using Specification in Controller
}
