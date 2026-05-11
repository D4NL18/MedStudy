package com.medstudy.backend.modules.sessao.mapper;

import com.medstudy.backend.modules.sessao.dto.StudySessionRequest;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class StudySessionMapperTest {

    private final StudySessionMapper mapper = Mappers.getMapper(StudySessionMapper.class);

    @Test
    void toEntity_ShouldMapCorrectly() {
        StudySessionRequest request = new StudySessionRequest(
                "Cirurgia", "Apendicite", LocalDate.now(), 10, 8, "USP", "obs", null, false
        );

        StudySession entity = mapper.toEntity(request);

        assertNotNull(entity);
        assertEquals("Cirurgia", entity.getGrandeArea());
        assertEquals("Apendicite", entity.getTema());
        assertEquals(10, entity.getQtsFeitas());
        assertEquals(8, entity.getQtsCorretas());
    }

    @Test
    void toResponse_ShouldMapCorrectly() {
        StudySession entity = new StudySession();
        entity.setId(UUID.randomUUID());
        entity.setGrandeArea("Clinica");
        entity.setTema("Pneumo");

        StudySessionResponse response = mapper.toResponse(entity);

        assertNotNull(response);
        assertEquals(entity.getId(), response.id());
        assertEquals("Clinica", response.grandeArea());
    }
}
