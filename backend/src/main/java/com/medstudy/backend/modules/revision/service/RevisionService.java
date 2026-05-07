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

    private final StudySessionRepository repository;
    private final StudySessionMapper mapper;

    @Transactional(readOnly = true)
    public RevisionSummaryResponse getSummary() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();

        return new RevisionSummaryResponse(
            repository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(userId, today),
            repository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(userId, today),
            repository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(userId, today),
            repository.countByUserIdAndRevisaoConcluidaTrue(userId)
        );
    }

    // Listing methods will be added as needed, or using Specification in Controller
}
