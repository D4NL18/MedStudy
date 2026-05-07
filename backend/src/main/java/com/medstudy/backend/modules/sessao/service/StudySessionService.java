package com.medstudy.backend.modules.sessao.service;

import com.medstudy.backend.modules.sessao.dto.StudySessionMetricsResponse;
import com.medstudy.backend.modules.sessao.dto.StudySessionRequest;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.sessao.mapper.StudySessionMapper;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.sessao.specification.StudySessionSpecifications;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class StudySessionService {

    private final StudySessionRepository repository;
    private final StudySessionMapper mapper;

    public StudySessionService(StudySessionRepository repository, StudySessionMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public StudySessionResponse createSession(StudySessionRequest request) {
        validateSession(request);

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        StudySession entity = mapper.toEntity(request);
        entity.setUser(currentUser);
        
        // Automated Logic: Calculate next revision
        entity.setDataProximaRevisao(calculateNextRevision(request.qtsCorretas(), request.qtsFeitas(), request.dataSessao()));

        StudySession saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    public Page<StudySessionResponse> findAll(String grandeArea, String tema, String instituicao, Boolean revisaoConcluida, Double minRate, Double maxRate, Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Specification<StudySession> spec = Specification.where(StudySessionSpecifications.hasUserId(currentUser.getId()))
                .and(StudySessionSpecifications.hasGrandeArea(grandeArea))
                .and(StudySessionSpecifications.hasTema(tema))
                .and(StudySessionSpecifications.hasInstituicao(instituicao))
                .and(StudySessionSpecifications.hasRevisaoConcluida(revisaoConcluida))
                .and(StudySessionSpecifications.hasMinSuccessRate(minRate))
                .and(StudySessionSpecifications.hasMaxSuccessRate(maxRate));

        return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    public StudySessionResponse getById(UUID id) {
        StudySession entity = getSessionAndVerifyOwnership(id);
        return mapper.toResponse(entity);
    }

    public StudySessionResponse updateSession(UUID id, StudySessionRequest request) {
        validateSession(request);
        StudySession entity = getSessionAndVerifyOwnership(id);

        entity.setGrandeArea(request.grandeArea());
        entity.setTema(request.tema());
        entity.setDataSessao(request.dataSessao());
        entity.setQtsFeitas(request.qtsFeitas());
        entity.setQtsCorretas(request.qtsCorretas());
        entity.setInstituicao(request.instituicao());
        entity.setRevisaoConcluida(request.revisaoConcluida());
        
        // Recalculate revision date on update
        entity.setDataProximaRevisao(calculateNextRevision(request.qtsCorretas(), request.qtsFeitas(), request.dataSessao()));

        StudySession saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    public void deleteSession(UUID id) {
        StudySession entity = getSessionAndVerifyOwnership(id);
        repository.delete(entity);
    }

    public StudySessionMetricsResponse getMetrics() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<StudySession> sessions = repository.findAll(StudySessionSpecifications.hasUserId(currentUser.getId()));

        long totalSessoes = sessions.size();
        long totalQuestoes = sessions.stream().mapToLong(StudySession::getQtsFeitas).sum();
        long totalCorretas = sessions.stream().mapToLong(StudySession::getQtsCorretas).sum();
        double mediaAcertos = totalQuestoes > 0 ? (double) totalCorretas / totalQuestoes * 100 : 0;

        LocalDate today = LocalDate.now();
        long revisoesCriticas = sessions.stream()
                .filter(s -> !s.getRevisaoConcluida() && s.getDataProximaRevisao() != null && s.getDataProximaRevisao().isBefore(today))
                .count();

        int streak = calculateStreak(sessions);

        return new StudySessionMetricsResponse(totalSessoes, totalQuestoes, mediaAcertos, revisoesCriticas, streak);
    }

    private void validateSession(StudySessionRequest request) {
        if (request.qtsCorretas() > request.qtsFeitas()) {
            throw new IllegalArgumentException("Quantidade de corretas não pode ser maior que o total de feitas");
        }
    }

    private StudySession getSessionAndVerifyOwnership(UUID id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        StudySession entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        if (!entity.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        return entity;
    }

    private LocalDate calculateNextRevision(int corretas, int feitas, LocalDate dataSessao) {
        if (feitas == 0) return null;
        double perc = (double) corretas / feitas * 100;
        int days;
        if (perc <= 65) days = 3;
        else if (perc <= 75) days = 5;
        else if (perc <= 85) days = 10;
        else days = 20;
        return dataSessao.plusDays(days);
    }

    private int calculateStreak(List<StudySession> sessions) {
        if (sessions.isEmpty()) return 0;

        List<LocalDate> dates = sessions.stream()
                .map(StudySession::getDataSessao)
                .distinct()
                .sorted(Comparator.reverseOrder())
                .toList();

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (!dates.get(0).equals(today) && !dates.get(0).equals(yesterday)) {
            return 0;
        }

        int streak = 1;
        for (int i = 0; i < dates.size() - 1; i++) {
            if (ChronoUnit.DAYS.between(dates.get(i+1), dates.get(i)) == 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
}
