package com.medstudy.backend.modules.profile.service;

import com.medstudy.backend.modules.profile.dto.ProfileDTO;
import com.medstudy.backend.modules.profile.entity.Profile;
import com.medstudy.backend.modules.profile.mapper.ProfileMapper;
import com.medstudy.backend.modules.profile.repository.ProfileRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.gamificacao.repository.UserBadgeRepository;
import com.medstudy.backend.modules.friendship.repository.FriendshipRepository;
import com.medstudy.backend.modules.friendship.entity.Friendship;
import com.medstudy.backend.modules.friendship.entity.FriendshipStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

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

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private UserBadgeRepository userBadgeRepository;

    @Mock
    private FriendshipRepository friendshipRepository;

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

        profileDTO = new ProfileDTO();
        profileDTO.setId(UUID.randomUUID());
        profileDTO.setUserId(user.getId());
        profileDTO.setHandle("pediatra_feliz");
        profileDTO.setNomeCompleto("Dr. Pedro");
        profileDTO.setIsFormado(false);
        profileDTO.setSemestre(5);
        profileDTO.setFaculdade("USP");
        profileDTO.setAvatarPresetId("pediatria");
        profileDTO.setIsPublic(true);
        profileDTO.setShareStreak(true);
        profileDTO.setShareFaculdade(true);
        profileDTO.setShareTotalQuestions(true);
        profileDTO.setShareBadges(true);

        profile = new Profile();
        profile.setId(profileDTO.getId());
        profile.setUser(user);
        profile.setHandle(profileDTO.getHandle());
        profile.setNomeCompleto(profileDTO.getNomeCompleto());
        profile.setSemestre(profileDTO.getSemestre());
        profile.setFaculdade(profileDTO.getFaculdade());
        profile.setAvatarPresetId(profileDTO.getAvatarPresetId());
        profile.setIsPublic(true);
        profile.setShareStreak(true);
        profile.setShareFaculdade(true);
        profile.setShareTotalQuestions(true);
        profile.setShareBadges(true);
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

    private void mockSecurityContext(User principal) {
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        if (principal != null) {
            when(authentication.getPrincipal()).thenReturn(principal);
        } else {
            when(authentication.getPrincipal()).thenReturn(null);
        }
        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getProfileByHandle_ShouldReturnFullProfile_WhenViewerIsOwner() {
        mockSecurityContext(user);
        
        when(profileRepository.findByHandle(profile.getHandle())).thenReturn(Optional.of(profile));
        when(profileMapper.toDTO(profile)).thenReturn(profileDTO);
        
        // Mock stats calls
        when(studySessionRepository.findDistinctSessionDatesByUserId(user.getId())).thenReturn(new ArrayList<>());
        when(studySessionRepository.sumTotalQuestionsByUserId(user.getId())).thenReturn(100L);
        when(userBadgeRepository.findAllByUserId(user.getId())).thenReturn(new ArrayList<>());

        Optional<ProfileDTO> result = profileService.getProfileByHandle(profile.getHandle());

        assertTrue(result.isPresent());
        ProfileDTO returnedDto = result.get();
        assertFalse(returnedDto.getIsPrivate());
        assertEquals(0, returnedDto.getStreak());
        assertEquals(100L, returnedDto.getTotalQuestions());
        assertEquals("NONE", returnedDto.getFriendshipStatus());
    }

    @Test
    void getProfileByHandle_ShouldReturnGranularProfile_WhenViewerIsFriend() {
        User friend = new User();
        friend.setId(UUID.randomUUID());
        mockSecurityContext(friend);

        // Friend viewer friendship mock
        Friendship friendship = new Friendship();
        friendship.setRequester(user);
        friendship.setReceiver(friend);
        friendship.setStatus(FriendshipStatus.ACCEPTED);

        when(profileRepository.findByHandle(profile.getHandle())).thenReturn(Optional.of(profile));
        when(profileMapper.toDTO(profile)).thenReturn(profileDTO);
        when(friendshipRepository.findFriendshipBetween(friend.getId(), user.getId()))
                .thenReturn(Optional.of(friendship));
        
        // Mock stats calls
        when(studySessionRepository.findDistinctSessionDatesByUserId(user.getId())).thenReturn(new ArrayList<>());
        when(studySessionRepository.sumTotalQuestionsByUserId(user.getId())).thenReturn(50L);
        when(userBadgeRepository.findAllByUserId(user.getId())).thenReturn(new ArrayList<>());

        // Disable shareStreak to test granular masking
        profile.setShareStreak(false);

        Optional<ProfileDTO> result = profileService.getProfileByHandle(profile.getHandle());

        assertTrue(result.isPresent());
        ProfileDTO returnedDto = result.get();
        assertFalse(returnedDto.getIsPrivate());
        assertNull(returnedDto.getStreak()); // Masked because shareStreak is false
        assertEquals(50L, returnedDto.getTotalQuestions());
        assertEquals("USP", returnedDto.getFaculdade());
        assertEquals("ACCEPTED", returnedDto.getFriendshipStatus());
    }

    @Test
    void getProfileByHandle_ShouldReturnGranularProfile_WhenViewerIsNonFriendAndPublic() {
        User viewer = new User();
        viewer.setId(UUID.randomUUID());
        mockSecurityContext(viewer);

        when(profileRepository.findByHandle(profile.getHandle())).thenReturn(Optional.of(profile));
        when(profileMapper.toDTO(profile)).thenReturn(profileDTO);
        when(friendshipRepository.findFriendshipBetween(viewer.getId(), user.getId()))
                .thenReturn(Optional.empty());
        
        // Mock stats calls
        when(studySessionRepository.findDistinctSessionDatesByUserId(user.getId())).thenReturn(new ArrayList<>());
        when(studySessionRepository.sumTotalQuestionsByUserId(user.getId())).thenReturn(50L);
        when(userBadgeRepository.findAllByUserId(user.getId())).thenReturn(new ArrayList<>());

        // Disable shareFaculdade
        profile.setShareFaculdade(false);

        Optional<ProfileDTO> result = profileService.getProfileByHandle(profile.getHandle());

        assertTrue(result.isPresent());
        ProfileDTO returnedDto = result.get();
        assertFalse(returnedDto.getIsPrivate());
        assertNull(returnedDto.getFaculdade()); // Masked because shareFaculdade is false
        assertEquals(50L, returnedDto.getTotalQuestions());
        assertEquals("NONE", returnedDto.getFriendshipStatus());
    }

    @Test
    void getProfileByHandle_ShouldReturnMaskedProfile_WhenViewerIsNonFriendAndPrivate() {
        User viewer = new User();
        viewer.setId(UUID.randomUUID());
        mockSecurityContext(viewer);

        profile.setIsPublic(false); // Private profile

        when(profileRepository.findByHandle(profile.getHandle())).thenReturn(Optional.of(profile));
        when(profileMapper.toDTO(profile)).thenReturn(profileDTO);
        when(friendshipRepository.findFriendshipBetween(viewer.getId(), user.getId()))
                .thenReturn(Optional.empty());
        
        // Mock stats calls
        when(studySessionRepository.findDistinctSessionDatesByUserId(user.getId())).thenReturn(new ArrayList<>());
        when(studySessionRepository.sumTotalQuestionsByUserId(user.getId())).thenReturn(50L);
        when(userBadgeRepository.findAllByUserId(user.getId())).thenReturn(new ArrayList<>());

        Optional<ProfileDTO> result = profileService.getProfileByHandle(profile.getHandle());

        assertTrue(result.isPresent());
        ProfileDTO returnedDto = result.get();
        assertTrue(returnedDto.getIsPrivate());
        assertNull(returnedDto.getFaculdade());
        assertNull(returnedDto.getSemestre());
        assertEquals(0, returnedDto.getStreak());
        assertEquals(0L, returnedDto.getTotalQuestions());
        assertTrue(returnedDto.getBadges().isEmpty());
    }
}
