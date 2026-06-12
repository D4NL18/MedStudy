package com.medstudy.backend.modules.aula.mapper;

import com.medstudy.backend.modules.aula.dto.LessonRequest;
import com.medstudy.backend.modules.aula.dto.LessonResponse;
import com.medstudy.backend.modules.aula.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Mapper for converting between Lesson entity and DTOs.
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface LessonMapper {

    /**
     * Converts a Lesson entity to a LessonResponse.
     *
     * @param entity the lesson entity
     * @return the corresponding response DTO
     */
    LessonResponse toResponse(Lesson entity);
    
    /**
     * Converts a LessonRequest to a Lesson entity.
     *
     * @param request the lesson request DTO
     * @return the corresponding entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Lesson toEntity(LessonRequest request);

    /**
     * Updates an existing Lesson entity from a LessonRequest.
     *
     * @param request the lesson request containing updated data
     * @param entity the lesson entity to update
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(LessonRequest request, @MappingTarget Lesson entity);
}
