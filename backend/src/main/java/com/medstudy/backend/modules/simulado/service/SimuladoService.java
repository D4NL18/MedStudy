package com.medstudy.backend.modules.simulado.service;

import com.medstudy.backend.modules.simulado.dto.SimuladoRequest;
import com.medstudy.backend.modules.simulado.dto.SimuladoResponse;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.simulado.mapper.SimuladoMapper;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import com.medstudy.backend.modules.simulado.specification.SimuladoSpecifications;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Service layer for managing mock exam sessions (Simulados).
 * <p>
 * Provides CRUD operations for exam sessions with filtering, ownership verification,
 * and gamification badge checks after each session is saved.
 * </p>
 */
@Service
@Transactional
public class SimuladoService {

    private final SimuladoRepository repository;
    private final UserRepository userRepository;
    private final SimuladoMapper mapper;
    private final com.medstudy.backend.modules.gamificacao.service.BadgeService badgeService;

    public SimuladoService(SimuladoRepository repository, 
                           UserRepository userRepository, 
                           SimuladoMapper mapper,
                           com.medstudy.backend.modules.gamificacao.service.BadgeService badgeService) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.badgeService = badgeService;
    }

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
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado no banco de dados"));
    }

    public SimuladoResponse create(SimuladoRequest request) {
        User currentUser = getCurrentUser();
        Simulado entity = mapper.toEntity(request);
        entity.setUser(currentUser);
        
        calculateAndValidateAreas(entity);

        Simulado saved = repository.save(entity);
        
        // Gamificação: Check for badges
        java.util.List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newBadges = badgeService.checkAndAwardBadges(currentUser.getId(), com.medstudy.backend.modules.gamificacao.enums.BadgeContext.SIMULADO_SESSION);
        
        return mapper.toResponse(saved, newBadges);
    }

    public Page<SimuladoResponse> findAll(String nome, Pageable pageable) {
        User currentUser = getCurrentUser();
        
        Specification<Simulado> spec = Specification.where(SimuladoSpecifications.hasUserId(currentUser.getId()))
                .and(SimuladoSpecifications.hasNome(nome));

        return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    public SimuladoResponse getById(UUID id) {
        Simulado entity = getSimuladoAndVerifyOwnership(id);
        return mapper.toResponse(entity);
    }

    public SimuladoResponse update(UUID id, SimuladoRequest request) {
        Simulado entity = getSimuladoAndVerifyOwnership(id);

        entity.setNome(request.getNome());
        entity.setDataRealizacao(request.getDataRealizacao());
        entity.setInstituicao(request.getInstituicao());
        entity.setAno(request.getAno());
        
        // Update areas
        entity.setCmTotal(request.getCmTotal() != null ? request.getCmTotal() : 0);
        entity.setCmAcertos(request.getCmAcertos() != null ? request.getCmAcertos() : 0);
        entity.setCmErros(request.getCmErros() != null ? request.getCmErros() : 0);
        
        entity.setCirTotal(request.getCirTotal() != null ? request.getCirTotal() : 0);
        entity.setCirAcertos(request.getCirAcertos() != null ? request.getCirAcertos() : 0);
        entity.setCirErros(request.getCirErros() != null ? request.getCirErros() : 0);
        
        entity.setPedTotal(request.getPedTotal() != null ? request.getPedTotal() : 0);
        entity.setPedAcertos(request.getPedAcertos() != null ? request.getPedAcertos() : 0);
        entity.setPedErros(request.getPedErros() != null ? request.getPedErros() : 0);
        
        entity.setGoTotal(request.getGoTotal() != null ? request.getGoTotal() : 0);
        entity.setGoAcertos(request.getGoAcertos() != null ? request.getGoAcertos() : 0);
        entity.setGoErros(request.getGoErros() != null ? request.getGoErros() : 0);
        
        entity.setPrevTotal(request.getPrevTotal() != null ? request.getPrevTotal() : 0);
        entity.setPrevAcertos(request.getPrevAcertos() != null ? request.getPrevAcertos() : 0);
        entity.setPrevErros(request.getPrevErros() != null ? request.getPrevErros() : 0);

        calculateAndValidateAreas(entity);

        Simulado saved = repository.save(entity);
        
        // Gamificação: Check for badges
        java.util.List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newBadges = badgeService.checkAndAwardBadges(getSimuladoAndVerifyOwnership(id).getUser().getId(), com.medstudy.backend.modules.gamificacao.enums.BadgeContext.SIMULADO_SESSION);
        
        return mapper.toResponse(saved, newBadges);
    }

    public void delete(UUID id) {
        Simulado entity = getSimuladoAndVerifyOwnership(id);
        repository.delete(entity);
    }

    public SimuladoResponse findLatestByInstituicao(String instituicao) {
        User currentUser = getCurrentUser();
        return repository.findFirstByUserIdAndInstituicaoIgnoreCaseOrderByCreatedAtDesc(currentUser.getId(), instituicao)
                .map(mapper::toResponse)
                .orElse(null);
    }

    private Simulado getSimuladoAndVerifyOwnership(UUID id) {
        User currentUser = getCurrentUser();
        Simulado entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Simulado não encontrado"));

        if (!entity.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        return entity;
    }

    private void calculateAndValidateAreas(Simulado s) {
        // CM
        AreaResult cm = calculateArea(s.getCmTotal(), s.getCmAcertos(), s.getCmErros());
        s.setCmTotal(cm.total); s.setCmAcertos(cm.acertos); s.setCmErros(cm.erros);
        
        // CIR
        AreaResult cir = calculateArea(s.getCirTotal(), s.getCirAcertos(), s.getCirErros());
        s.setCirTotal(cir.total); s.setCirAcertos(cir.acertos); s.setCirErros(cir.erros);
        
        // PED
        AreaResult ped = calculateArea(s.getPedTotal(), s.getPedAcertos(), s.getPedErros());
        s.setPedTotal(ped.total); s.setPedAcertos(ped.acertos); s.setPedErros(ped.erros);
        
        // GO
        AreaResult go = calculateArea(s.getGoTotal(), s.getGoAcertos(), s.getGoErros());
        s.setGoTotal(go.total); s.setGoAcertos(go.acertos); s.setGoErros(go.erros);
        
        // PREV
        AreaResult prev = calculateArea(s.getPrevTotal(), s.getPrevAcertos(), s.getPrevErros());
        s.setPrevTotal(prev.total); s.setPrevAcertos(prev.acertos); s.setPrevErros(prev.erros);
    }

    private AreaResult calculateArea(Integer total, Integer acertos, Integer erros) {
        int t = total != null ? total : 0;
        int a = acertos != null ? acertos : 0;
        int e = erros != null ? erros : 0;

        if (t > 0 && a > 0 && e == 0) e = Math.max(0, t - a);
        else if (t > 0 && e > 0 && a == 0) a = Math.max(0, t - e);
        else if (a > 0 && e > 0 && t == 0) t = a + e;
        else if (t > 0 && a > 0 && e > 0 && a + e != t) {
            throw new IllegalArgumentException("Soma de acertos e erros não confere com o total");
        }
        
        if (a + e > t && t > 0) {
             throw new IllegalArgumentException("Soma de acertos e erros não pode ser maior que o total");
        }

        return new AreaResult(t, a, e);
    }

    private record AreaResult(int total, int acertos, int erros) {}
}
