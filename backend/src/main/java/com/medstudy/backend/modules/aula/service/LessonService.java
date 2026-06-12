package com.medstudy.backend.modules.aula.service;

import com.medstudy.backend.modules.aula.dto.LessonRequest;
import com.medstudy.backend.modules.aula.dto.LessonResponse;
import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.mapper.LessonMapper;
import com.medstudy.backend.modules.aula.repository.LessonRepository;
import com.medstudy.backend.modules.aula.specification.LessonSpecifications;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service for managing Lesson business logic.
 */
@Service
@Transactional
public class LessonService {

    private final LessonRepository repository;
    private final LessonMapper mapper;

    /**
     * Constructor for LessonService.
     *
     * @param repository the lesson repository
     * @param mapper the lesson mapper
     */
    public LessonService(LessonRepository repository, LessonMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    /**
     * Creates a new lesson.
     *
     * @param request the request containing lesson details
     * @return the created lesson response
     */
    public LessonResponse create(LessonRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Lesson entity = mapper.toEntity(request);
        entity.setUser(currentUser);
        
        if (entity.getAulaAssistida() == null) entity.setAulaAssistida(false);
        if (entity.getReforco() == null) entity.setReforco(false);
        if (entity.getRevisao() == null) entity.setRevisao(false);
        
        Lesson saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    /**
     * Retrieves a paginated list of lessons matching provided filters.
     *
     * @param grandeArea optional filter by major area
     * @param prioridade optional filter by priority
     * @param aulaAssistida optional filter by watched status
     * @param tema optional filter by theme
     * @param pageable pagination parameters
     * @return a paginated list of lesson responses
     */
    public Page<LessonResponse> findAll(String grandeArea, LessonPriority prioridade, Boolean aulaAssistida, String tema, Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Specification<Lesson> spec = Specification.where(LessonSpecifications.hasUserId(currentUser.getId()))
                .and(LessonSpecifications.hasGrandeArea(grandeArea))
                .and(LessonSpecifications.hasPrioridade(prioridade))
                .and(LessonSpecifications.hasAulaAssistida(aulaAssistida))
                .and(LessonSpecifications.hasTema(tema));

        return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    /**
     * Retrieves a lesson by its ID.
     *
     * @param id the UUID of the lesson
     * @return the lesson response
     */
    public LessonResponse getById(UUID id) {
        Lesson entity = getLessonAndVerifyOwnership(id);
        return mapper.toResponse(entity);
    }

    /**
     * Retrieves a summary of lessons for the current user.
     *
     * @return the lesson summary response
     */
    public com.medstudy.backend.modules.aula.dto.LessonSummaryResponse getSummary() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = currentUser.getId();
        
        long total = repository.countByUserId(userId);
        long assistidas = repository.countByUserIdAndAulaAssistidaTrue(userId);
        long pendentes = repository.countByUserIdAndAulaAssistidaFalse(userId);
        long diamantePendentes = repository.countByUserIdAndAulaAssistidaFalseAndPrioridade(userId, LessonPriority.DIAMANTE);

        return new com.medstudy.backend.modules.aula.dto.LessonSummaryResponse(total, assistidas, pendentes, diamantePendentes);
    }

    /**
     * Updates an existing lesson.
     *
     * @param id the UUID of the lesson
     * @param request the request containing updated details
     * @return the updated lesson response
     */
    public LessonResponse update(UUID id, LessonRequest request) {
        Lesson entity = getLessonAndVerifyOwnership(id);

        entity.setGrandeArea(request.getGrandeArea());
        entity.setSubArea(request.getSubArea());
        entity.setTema(request.getTema());
        entity.setPrioridade(request.getPrioridade());
        
        if (request.getAulaAssistida() != null) entity.setAulaAssistida(request.getAulaAssistida());
        if (request.getDataAula() != null) entity.setDataAula(request.getDataAula());
        if (request.getPercentAcerto() != null) entity.setPercentAcerto(request.getPercentAcerto());
        if (request.getReforco() != null) entity.setReforco(request.getReforco());
        if (request.getRevisao() != null) entity.setRevisao(request.getRevisao());

        Lesson saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    /**
     * Deletes a lesson by its ID.
     *
     * @param id the UUID of the lesson
     */
    public void delete(UUID id) {
        Lesson entity = getLessonAndVerifyOwnership(id);
        repository.delete(entity);
    }

    /**
     * Toggles the watched status of a lesson.
     *
     * @param id the UUID of the lesson
     * @return the updated lesson response
     */
    public LessonResponse toggleAssistida(UUID id) {
        Lesson entity = getLessonAndVerifyOwnership(id);
        boolean newState = !entity.getAulaAssistida();
        entity.setAulaAssistida(newState);
        
        if (newState && entity.getDataAula() == null) {
            entity.setDataAula(java.time.LocalDate.now());
        }
        
        Lesson saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    /**
     * Helper method to retrieve a lesson and verify the current user owns it.
     *
     * @param id the UUID of the lesson
     * @return the lesson entity
     * @throws RuntimeException if not found or unauthorized
     */
    private Lesson getLessonAndVerifyOwnership(UUID id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Lesson entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (!entity.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        return entity;
    }
}
