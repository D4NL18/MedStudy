package com.medstudy.backend.modules.user.mapper;

import com.medstudy.backend.modules.user.dto.UserResponse;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class UserMapperTest {

    private final UserMapper mapper = Mappers.getMapper(UserMapper.class);

    @Test
    void toResponse_ShouldMapFields() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("Test");
        user.setEmail("test@test.com");
        
        UserResponse response = mapper.toResponse(user);
        
        assertNotNull(response);
        assertEquals("Test", response.getName());
        assertEquals("test@test.com", response.getEmail());
    }
}
