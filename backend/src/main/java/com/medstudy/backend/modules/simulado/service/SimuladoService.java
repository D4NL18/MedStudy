package com.medstudy.backend.modules.simulado.service;

import com.medstudy.backend.modules.simulado.dto.SimuladoRequest;
import com.medstudy.backend.modules.simulado.dto.SimuladoResponse;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.simulado.mapper.SimuladoMapper;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import com.medstudy.backend.modules.simulado.specification.SimuladoSpecifications;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class SimuladoService {

    private final SimuladoRepository repository;
    private final SimuladoMapper mapper;

    public SimuladoService(SimuladoRepository repository, SimuladoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public SimuladoResponse create(SimuladoRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Simulado entity = mapper.toEntity(request);
        entity.setUser(currentUser);
        
        calculateAndValidateAreas(entity);

        Simulado saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    public Page<SimuladoResponse> findAll(String nome, Pageable pageable) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
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

        entity.setNome(request.nome());
        entity.setDataRealizacao(request.dataRealizacao());
        
        // Update areas
        entity.setCmTotal(request.cmTotal());
        entity.setCmAcertos(request.cmAcertos());
        entity.setCmErros(request.cmErros());
        
        entity.setCirTotal(request.cirTotal());
        entity.setCirAcertos(request.cirAcertos());
        entity.setCirErros(request.cirErros());
        
        entity.setPedTotal(request.pedTotal());
        entity.setPedAcertos(request.pedAcertos());
        entity.setPedErros(request.pedErros());
        
        entity.setGoTotal(request.goTotal());
        entity.setGoAcertos(request.goAcertos());
        entity.setGoErros(request.goErros());
        
        entity.setPrevTotal(request.prevTotal());
        entity.setPrevAcertos(request.prevAcertos());
        entity.setPrevErros(request.prevErros());

        calculateAndValidateAreas(entity);

        Simulado saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    public void delete(UUID id) {
        Simulado entity = getSimuladoAndVerifyOwnership(id);
        repository.delete(entity);
    }

    private Simulado getSimuladoAndVerifyOwnership(UUID id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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

    private AreaResult calculateArea(int total, int acertos, int erros) {
        int t = total; int a = acertos; int e = erros;

        if (t > 0 && a > 0 && e == 0) e = Math.max(0, t - a);
        else if (t > 0 && e > 0 && a == 0) a = Math.max(0, t - e);
        else if (a > 0 && e > 0 && t == 0) t = a + e;
        else if (t > 0 && a > 0 && e > 0) {
             // If all provided, prioritize acertos/erros over total if inconsistent?
             // Or just validate.
             if (a + e != t) {
                 throw new IllegalArgumentException("Soma de acertos e erros não confere com o total");
             }
        }
        
        if (a + e > t && t > 0) {
             throw new IllegalArgumentException("Soma de acertos e erros não pode ser maior que o total");
        }

        return new AreaResult(t, a, e);
    }

    private record AreaResult(int total, int acertos, int erros) {}
}
