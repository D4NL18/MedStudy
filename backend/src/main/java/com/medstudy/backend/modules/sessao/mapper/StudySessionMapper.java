package com.medstudy.backend.modules.sessao.mapper;

import com.medstudy.backend.modules.sessao.dto.StudySessionRequest;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
/** Mapper for converting between {@link StudySession} entities and DTOs. */
public interface StudySessionMapper {
    StudySessionResponse toResponse(StudySession entity);

    @Mapping(target = "newlyEarnedBadges", source = "newlyEarnedBadges")
    StudySessionResponse toResponse(StudySession entity, java.util.List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newlyEarnedBadges);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    StudySession toEntity(StudySessionRequest request);
}
