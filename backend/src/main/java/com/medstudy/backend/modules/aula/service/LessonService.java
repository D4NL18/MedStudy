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

@Service
@Transactional
public class LessonService {

    private final LessonRepository repository;
    private final LessonMapper mapper;

    public LessonService(LessonRepository repository, LessonMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public LessonResponse create(LessonRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Lesson entity = mapper.toEntity(request);
        entity.setUser(currentUser);
        
        Lesson saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    public Page<LessonResponse> findAll(String grandeArea, LessonPriority prioridade, Boolean aulaAssistida, String tema, Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        Specification<Lesson> spec = Specification.where(LessonSpecifications.hasUserId(currentUser.getId()))
                .and(LessonSpecifications.hasGrandeArea(grandeArea))
                .and(LessonSpecifications.hasPrioridade(prioridade))
                .and(LessonSpecifications.hasAulaAssistida(aulaAssistida))
                .and(LessonSpecifications.hasTema(tema));

        return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    public LessonResponse getById(UUID id) {
        Lesson entity = getLessonAndVerifyOwnership(id);
        return mapper.toResponse(entity);
    }

    public LessonResponse update(UUID id, LessonRequest request) {
        Lesson entity = getLessonAndVerifyOwnership(id);

        entity.setGrandeArea(request.grandeArea());
        entity.setTema(request.tema());
        entity.setPrioridade(request.prioridade());
        entity.setAulaAssistida(request.aulaAssistida());

        Lesson saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    public void delete(UUID id) {
        Lesson entity = getLessonAndVerifyOwnership(id);
        repository.delete(entity);
    }

    public LessonResponse toggleAssistida(UUID id) {
        Lesson entity = getLessonAndVerifyOwnership(id);
        entity.setAulaAssistida(!entity.getAulaAssistida());
        Lesson saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    private Lesson getLessonAndVerifyOwnership(UUID id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Lesson entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));

        if (!entity.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        return entity;
    }
}
