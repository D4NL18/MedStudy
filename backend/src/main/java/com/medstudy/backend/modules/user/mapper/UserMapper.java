package com.medstudy.backend.modules.user.mapper;

import com.medstudy.backend.modules.user.dto.UserRequest;
import com.medstudy.backend.modules.user.dto.UserResponse;
import com.medstudy.backend.modules.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Mapper for converting between User entity and its corresponding DTOs.
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    /**
     * Converts a User entity to a UserResponse DTO.
     *
     * @param user the user entity
     * @return the user response DTO
     */
    UserResponse toResponse(User user);
    
    /**
     * Converts a UserRequest DTO to a User entity.
     *
     * @param request the user request DTO
     * @return the user entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    User toEntity(UserRequest request);
}
