package com.medstudy.backend.modules.profile.service;

import com.medstudy.backend.modules.profile.dto.ProfileDTO;
import com.medstudy.backend.modules.profile.entity.Profile;
import com.medstudy.backend.modules.profile.mapper.ProfileMapper;
import com.medstudy.backend.modules.profile.repository.ProfileRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private ProfileMapper profileMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProfileService profileService;

    private User user;
    private ProfileDTO profileDTO;
    private Profile profile;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("medico@medstudy.com");

        profileDTO = new ProfileDTO(
                UUID.randomUUID(),
                user.getId(),
                "pediatra_feliz",
                "Dr. Pedro",
                false,
                5,
                "USP",
                "pediatria"
        );

        profile = new Profile();
        profile.setId(profileDTO.getId());
        profile.setUser(user);
        profile.setHandle(profileDTO.getHandle());
        profile.setNomeCompleto(profileDTO.getNomeCompleto());
        profile.setSemestre(profileDTO.getSemestre());
        profile.setFaculdade(profileDTO.getFaculdade());
        profile.setAvatarPresetId(profileDTO.getAvatarPresetId());
    }

    @Test
    void getProfileByUserId_ShouldReturnDTO_WhenExists() {
        when(profileRepository.findByUserId(user.getId())).thenReturn(Optional.of(profile));
        when(profileMapper.toDTO(profile)).thenReturn(profileDTO);

        Optional<ProfileDTO> result = profileService.getProfileByUserId(user.getId());

        assertTrue(result.isPresent());
        assertEquals(profileDTO.getHandle(), result.get().getHandle());
    }

    @Test
    void isHandleAvailable_ShouldReturnTrue_WhenUnique() {
        when(profileRepository.existsByHandleAndUserIdNot("pediatra_feliz", user.getId())).thenReturn(false);

        boolean result = profileService.isHandleAvailable("pediatra_feliz", user.getId());

        assertTrue(result);
    }

    @Test
    void isHandleAvailable_ShouldReturnFalse_WhenTaken() {
        when(profileRepository.existsByHandleAndUserIdNot("taken_handle", user.getId())).thenReturn(true);

        boolean result = profileService.isHandleAvailable("taken_handle", user.getId());

        assertFalse(result);
    }

    @Test
    void createOrUpdateProfile_ShouldSaveProfile_WhenHandleAvailable() {
        when(profileRepository.existsByHandleAndUserIdNot(profileDTO.getHandle(), user.getId())).thenReturn(false);
        when(profileRepository.findByUserId(user.getId())).thenReturn(Optional.empty());
        when(profileRepository.save(any(Profile.class))).thenReturn(profile);
        when(profileMapper.toDTO(profile)).thenReturn(profileDTO);

        ProfileDTO result = profileService.createOrUpdateProfile(profileDTO, user);

        assertNotNull(result);
        assertEquals(profileDTO.getHandle(), result.getHandle());
        verify(profileRepository).save(any(Profile.class));
    }

    @Test
    void createOrUpdateProfile_ShouldThrowException_WhenHandleTaken() {
        when(profileRepository.existsByHandleAndUserIdNot(profileDTO.getHandle(), user.getId())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> profileService.createOrUpdateProfile(profileDTO, user));
        verify(profileRepository, never()).save(any());
    }
}
