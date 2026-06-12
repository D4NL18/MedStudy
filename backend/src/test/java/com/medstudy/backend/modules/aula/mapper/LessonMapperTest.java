package com.medstudy.backend.modules.aula.mapper;

import com.medstudy.backend.modules.aula.dto.LessonRequest;
import com.medstudy.backend.modules.aula.dto.LessonResponse;
import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class LessonMapperTest {

    private final LessonMapper mapper = Mappers.getMapper(LessonMapper.class);

    @Test
    void toEntity_ShouldMapCorrectly() {
        LessonRequest request = new LessonRequest("Area", "Sub", "Tema", LessonPriority.ALTA, false, null, 0, false, false);
        Lesson entity = mapper.toEntity(request);

        assertNotNull(entity);
        assertEquals("Area", entity.getGrandeArea());
        assertEquals(LessonPriority.ALTA, entity.getPrioridade());
    }

    @Test
    void toResponse_ShouldMapCorrectly() {
        Lesson entity = new Lesson();
        entity.setId(UUID.randomUUID());
        entity.setTema("Tema");

        LessonResponse response = mapper.toResponse(entity);

        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());
    }

    @Test
    void updateEntity_ShouldModifyExisting() {
        Lesson entity = new Lesson();
        entity.setTema("Old");
        
        java.time.LocalDate now = java.time.LocalDate.now();
        LessonRequest request = new LessonRequest("Area", "Sub", "New", LessonPriority.BAIXA, true, now, 80, true, true);
        mapper.updateEntityFromRequest(request, entity);
        
        assertEquals("New", entity.getTema());
        assertTrue(entity.getAulaAssistida());
        assertEquals(now, entity.getDataAula());
    }
}
