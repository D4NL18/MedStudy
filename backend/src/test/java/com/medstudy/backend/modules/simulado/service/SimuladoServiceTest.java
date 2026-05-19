package com.medstudy.backend.modules.simulado.service;

import com.medstudy.backend.modules.simulado.dto.SimuladoRequest;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.simulado.mapper.SimuladoMapper;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SimuladoServiceTest {

    @Mock
    private SimuladoRepository repository;

    @Mock
    private SimuladoMapper mapper;

    @Mock
    private com.medstudy.backend.modules.gamificacao.service.BadgeService badgeService;

    @InjectMocks
    private SimuladoService service;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        lenient().when(badgeService.checkAndAwardBadges(any())).thenReturn(java.util.Collections.emptyList());
    }

    @Test
    void shouldCalculateErrosWhenTotalAndAcertosProvided() {
        SimuladoRequest request = new SimuladoRequest("Simulado Teste", LocalDate.now(), 
            "INST", 2024,
            10, 8, 0, // CM
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            
        Simulado entity = new Simulado();
        entity.setNome(request.nome());
        entity.setCmTotal(10);
        entity.setCmAcertos(8);
        entity.setCmErros(0);
        
        when(mapper.toEntity(any())).thenReturn(entity);
        when(repository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        service.create(request);

        assertEquals(2, entity.getCmErros());
    }

    @Test
    void shouldCalculateAcertosWhenTotalAndErrosProvided() {
        SimuladoRequest request = new SimuladoRequest("Simulado Teste", LocalDate.now(), 
            "INST", 2024,
            10, 0, 3, // CM
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            
        Simulado entity = new Simulado();
        entity.setCmTotal(10);
        entity.setCmAcertos(0);
        entity.setCmErros(3);
        
        when(mapper.toEntity(any())).thenReturn(entity);
        when(repository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        service.create(request);

        assertEquals(7, entity.getCmAcertos());
    }

    @Test
    void shouldCalculateTotalWhenAcertosAndErrosProvided() {
        SimuladoRequest request = new SimuladoRequest("Simulado Teste", LocalDate.now(), 
            "INST", 2024,
            0, 5, 5, // CM
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            
        Simulado entity = new Simulado();
        entity.setCmTotal(0);
        entity.setCmAcertos(5);
        entity.setCmErros(5);
        
        when(mapper.toEntity(any())).thenReturn(entity);
        when(repository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        service.create(request);

        assertEquals(10, entity.getCmTotal());
    }

    @Test
    void shouldThrowExceptionWhenAcertosPlusErrosGreaterThanTotal() {
        SimuladoRequest request = new SimuladoRequest("Simulado Teste", LocalDate.now(), 
            "INST", 2024,
            10, 6, 6, // CM
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            
        Simulado entity = new Simulado();

        entity.setCmTotal(10);
        entity.setCmAcertos(6);
        entity.setCmErros(6);
        
        when(mapper.toEntity(any())).thenReturn(entity);

        assertThrows(IllegalArgumentException.class, () -> service.create(request));
    }

    @Test

    void update_ShouldUpdateFields() {
        UUID id = UUID.randomUUID();
        Simulado entity = new Simulado();
        entity.setUser(user);
        when(repository.findById(id)).thenReturn(java.util.Optional.of(entity));
        when(repository.save(any())).thenReturn(entity);

        SimuladoRequest request = new SimuladoRequest("New Name", LocalDate.now(), "Inst", 2024, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        service.update(id, request);

        assertEquals("New Name", entity.getNome());
        verify(repository).save(entity);
    }

    @Test
    void shouldCalculateForOtherAreas() {
        SimuladoRequest request = new SimuladoRequest("S", LocalDate.now(), "I", 2024,
            0, 0, 0,
            10, 5, 0, // GO
            10, 0, 2, // Ped
            0, 7, 3,  // Prev
            0, 0, 0);
            
        Simulado entity = new Simulado();
        entity.setGoTotal(10); entity.setGoAcertos(5);
        entity.setPedTotal(10); entity.setPedErros(2);
        entity.setPrevAcertos(7); entity.setPrevErros(3);
        
        when(mapper.toEntity(any())).thenReturn(entity);
        when(repository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        service.create(request);

        assertEquals(5, entity.getGoErros());
        assertEquals(8, entity.getPedAcertos());
        assertEquals(10, entity.getPrevTotal());
    }

    @Test
    void findLatestByInstituicao_ShouldReturnLastSimulado() {
        Simulado s1 = new Simulado();
        s1.setInstituicao("USP");
        when(repository.findFirstByUserIdAndInstituicaoIgnoreCaseOrderByCreatedAtDesc(user.getId(), "USP")).thenReturn(java.util.Optional.of(s1));
        
        service.findLatestByInstituicao("USP");
        verify(repository).findFirstByUserIdAndInstituicaoIgnoreCaseOrderByCreatedAtDesc(user.getId(), "USP");
    }

    @Test
    void delete_ShouldThrowException_WhenNotOwner() {
        UUID id = UUID.randomUUID();
        Simulado entity = new Simulado();
        User other = new User();
        other.setId(UUID.randomUUID());
        entity.setUser(other);
        when(repository.findById(id)).thenReturn(java.util.Optional.of(entity));

        assertThrows(RuntimeException.class, () -> service.delete(id));
    }
}

