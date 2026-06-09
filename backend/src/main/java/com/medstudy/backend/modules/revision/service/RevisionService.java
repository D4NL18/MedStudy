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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import com.medstudy.backend.modules.sessao.specification.StudySessionSpecifications;
import com.medstudy.backend.modules.sessao.entity.StudySession;

import java.time.LocalDate;
import java.util.UUID;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RevisionService {

    private final StudySessionRepository sessionRepository;
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
    public Page<StudySessionResponse> getSessions(String tipo, String search, Pageable pageable) {
        User user = getCurrentUser();
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();
        
        Specification<StudySession> spec = Specification.where(StudySessionSpecifications.hasUserId(userId))
            .and(StudySessionSpecifications.hasTipoRevision(tipo, today))
            .and(StudySessionSpecifications.search(search));
        
        return sessionRepository.findAll(spec, pageable).map(mapper::toResponse);
    }
}
