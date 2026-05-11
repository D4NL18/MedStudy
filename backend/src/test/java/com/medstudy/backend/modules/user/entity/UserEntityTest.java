package com.medstudy.backend.modules.user.entity;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static org.junit.jupiter.api.Assertions.*;

class UserEntityTest {

    @Test
    void userDetails_ShouldReturnCorrectValues() {
        User user = new User();
        user.setEmail("test@test.com");
        user.setRole("ROLE_USER");
        
        assertEquals("test@test.com", user.getUsername());
        assertTrue(user.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
    }
}
