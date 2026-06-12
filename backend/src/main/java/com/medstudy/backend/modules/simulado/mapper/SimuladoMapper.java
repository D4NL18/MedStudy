package com.medstudy.backend.modules.simulado.mapper;

import com.medstudy.backend.modules.simulado.dto.SimuladoRequest;
import com.medstudy.backend.modules.simulado.dto.SimuladoResponse;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
/** Mapper for converting between {@link Simulado} entities and DTOs. */
public interface SimuladoMapper {
    SimuladoResponse toResponse(Simulado entity);

    @Mapping(target = "newlyEarnedBadges", source = "newlyEarnedBadges")
    SimuladoResponse toResponse(Simulado entity, java.util.List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newlyEarnedBadges);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Simulado toEntity(SimuladoRequest request);
}
