package com.medstudy.backend.modules.revision.service;

import com.medstudy.backend.modules.revision.dto.RevisionSummaryResponse;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.mapper.StudySessionMapper;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevisionService {

    private final StudySessionRepository sessionRepository;
    private final com.medstudy.backend.modules.flashcard.repository.FlashcardRepository flashcardRepository;
    private final StudySessionMapper mapper;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new RuntimeException("Sessão expirada ou usuário não autenticado");
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            throw new RuntimeException("Tipo de principal inválido: " + principal.getClass().getName());
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + email));
    }

    @Transactional(readOnly = true)
    public RevisionSummaryResponse getSummary() {
        User user = getCurrentUser();
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();

        // Study Sessions
        long sessionsAtrasadas = sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(userId, today);
        long sessionsHoje = sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(userId, today);
        long sessionsFuturas = sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(userId, today);
        long sessionsConcluidas = sessionRepository.countByUserIdAndRevisaoConcluidaTrue(userId);

        return new RevisionSummaryResponse(
            sessionsAtrasadas,
            sessionsHoje,
            sessionsFuturas,
            sessionsConcluidas
        );
    }

    @Transactional(readOnly = true)
    public List<StudySessionResponse> getSessions(String tipo) {
        User user = getCurrentUser();
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();
        
        List<com.medstudy.backend.modules.sessao.entity.StudySession> sessions;
        
        switch (tipo != null ? tipo.toUpperCase() : "") {
            case "ATRASADAS":
                sessions = sessionRepository.findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(userId, today);
                break;
            case "HOJE":
                sessions = sessionRepository.findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(userId, today);
                break;
            case "FUTURAS":
                sessions = sessionRepository.findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(userId, today);
                break;
            case "CONCLUIDAS":
                sessions = sessionRepository.findByUserIdAndRevisaoConcluidaTrue(userId);
                break;
            default:
                // Fallback to HOJE if unknown
                sessions = sessionRepository.findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(userId, today);
                break;
        }
        
        return sessions.stream().map(mapper::toResponse).collect(Collectors.toList());
    }
}
