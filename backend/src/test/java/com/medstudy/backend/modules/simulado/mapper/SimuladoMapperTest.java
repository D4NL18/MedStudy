package com.medstudy.backend.modules.simulado.mapper;

import com.medstudy.backend.modules.simulado.dto.SimuladoRequest;
import com.medstudy.backend.modules.simulado.dto.SimuladoResponse;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class SimuladoMapperTest {

    private final SimuladoMapper mapper = Mappers.getMapper(SimuladoMapper.class);

    @Test
    void toEntity_ShouldMapCorrectly() {
        SimuladoRequest request = new SimuladoRequest("Sim", LocalDate.now(), "Inst", 2024, 10, 8, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        Simulado entity = mapper.toEntity(request);

        assertNotNull(entity);
        assertEquals("Sim", entity.getNome());
        assertEquals(10, entity.getCmTotal());
    }

    @Test
    void toResponse_ShouldMapCorrectly() {
        Simulado entity = new Simulado();
        entity.setId(UUID.randomUUID());
        entity.setNome("Sim");

        SimuladoResponse response = mapper.toResponse(entity);

        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());
    }
}
