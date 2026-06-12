package com.medstudy.backend.modules.profile.mapper;

import com.medstudy.backend.modules.profile.dto.ProfileDTO;
import com.medstudy.backend.modules.profile.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
/** Mapper for converting between {@link Profile} entities and DTOs. */
public interface ProfileMapper {

    @Mapping(source = "user.id", target = "userId")
    ProfileDTO toDTO(Profile entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Profile toEntity(ProfileDTO dto);
}
