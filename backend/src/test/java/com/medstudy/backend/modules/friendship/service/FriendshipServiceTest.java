package com.medstudy.backend.modules.friendship.service;

import com.medstudy.backend.modules.friendship.dto.SocialProfileResponseDTO;
import com.medstudy.backend.modules.friendship.entity.Friendship;
import com.medstudy.backend.modules.friendship.entity.FriendshipStatus;
import com.medstudy.backend.modules.friendship.repository.FriendshipRepository;
import com.medstudy.backend.modules.notificacao.service.NotificationService;
import com.medstudy.backend.modules.profile.entity.Profile;
import com.medstudy.backend.modules.profile.repository.ProfileRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FriendshipServiceTest {

    @Mock
    private FriendshipRepository friendshipRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private FriendshipService friendshipService;

    private User currentUser;
    private User otherUser;
    private Profile currentProfile;
    private Profile otherProfile;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(UUID.randomUUID());
        currentUser.setEmail("current@medstudy.com");
        currentUser.setName("User Current");

        otherUser = new User();
        otherUser.setId(UUID.randomUUID());
        otherUser.setEmail("other@medstudy.com");
        otherUser.setName("User Other");

        currentProfile = new Profile();
        currentProfile.setUser(currentUser);
        currentProfile.setNomeCompleto("Estudante Atual");
        currentProfile.setHandle("atual");

        otherProfile = new Profile();
        otherProfile.setUser(otherUser);
        otherProfile.setNomeCompleto("Outro Estudante");
        otherProfile.setHandle("outro");
        otherProfile.setFaculdade("USP");
        otherProfile.setSemestre(6);
        otherProfile.setAvatarPresetId("pediatrics");
        otherProfile.setIsFormado(false);

        // Mock Security Context
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void searchProfiles_ShouldReturnMatchingProfiles() {
        when(profileRepository.searchProfiles("Outro", currentUser.getId()))
                .thenReturn(List.of(otherProfile));
        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.empty());
        when(studySessionRepository.findDistinctSessionDatesByUserId(otherUser.getId()))
                .thenReturn(List.of(LocalDate.now()));

        List<SocialProfileResponseDTO> result = friendshipService.searchProfiles("Outro");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Outro Estudante", result.get(0).getName());
        assertEquals("NONE", result.get(0).getRelationshipStatus());
        assertEquals(1, result.get(0).getStreak());
    }

    @Test
    void searchProfiles_ShouldFilterOutBlockedRequester() {
        Friendship friendship = new Friendship();
        friendship.setRequester(otherUser);
        friendship.setReceiver(currentUser);
        friendship.setStatus(FriendshipStatus.BLOCKED);

        when(profileRepository.searchProfiles("Outro", currentUser.getId()))
                .thenReturn(List.of(otherProfile));
        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.of(friendship));

        List<SocialProfileResponseDTO> result = friendshipService.searchProfiles("Outro");

        assertNotNull(result);
        assertTrue(result.isEmpty()); // Filtered out because otherUser blocked currentUser
    }

    @Test
    void sendFriendRequest_ShouldCreatePendingFriendship() {
        when(userRepository.findById(otherUser.getId())).thenReturn(Optional.of(otherUser));
        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.empty());
        when(profileRepository.findByUserId(currentUser.getId())).thenReturn(Optional.of(currentProfile));

        friendshipService.sendFriendRequest(otherUser.getId());

        verify(friendshipRepository, times(1)).save(any(Friendship.class));
        verify(notificationService, times(1)).createNotification(
                eq(otherUser), eq(currentUser), eq("FRIEND_REQUEST"), anyString()
        );
    }

    @Test
    void sendFriendRequest_ShouldThrowException_WhenAddingSelf() {
        assertThrows(IllegalArgumentException.class, () -> 
                friendshipService.sendFriendRequest(currentUser.getId())
        );
    }

    @Test
    void sendFriendRequest_ShouldThrowException_WhenAlreadyFriends() {
        Friendship friendship = new Friendship();
        friendship.setRequester(currentUser);
        friendship.setReceiver(otherUser);
        friendship.setStatus(FriendshipStatus.ACCEPTED);

        when(userRepository.findById(otherUser.getId())).thenReturn(Optional.of(otherUser));
        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.of(friendship));

        assertThrows(IllegalStateException.class, () -> 
                friendshipService.sendFriendRequest(otherUser.getId())
        );
    }

    @Test
    void acceptFriendRequest_ShouldUpdateStatusToAccepted() {
        Friendship friendship = new Friendship();
        friendship.setRequester(otherUser);
        friendship.setReceiver(currentUser);
        friendship.setStatus(FriendshipStatus.PENDING);

        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.of(friendship));
        when(profileRepository.findByUserId(currentUser.getId())).thenReturn(Optional.of(currentProfile));

        friendshipService.acceptFriendRequest(otherUser.getId());

        assertEquals(FriendshipStatus.ACCEPTED, friendship.getStatus());
        verify(friendshipRepository, times(1)).save(friendship);
        verify(notificationService, times(1)).createNotification(
                eq(otherUser), eq(currentUser), eq("FRIEND_ACCEPTED"), anyString()
        );
    }

    @Test
    void declineFriendRequest_ShouldDeleteRelation() {
        Friendship friendship = new Friendship();
        friendship.setRequester(otherUser);
        friendship.setReceiver(currentUser);
        friendship.setStatus(FriendshipStatus.PENDING);

        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.of(friendship));

        friendshipService.declineFriendRequest(otherUser.getId());

        verify(friendshipRepository, times(1)).delete(friendship);
    }

    @Test
    void removeFriend_ShouldDeleteRelation() {
        Friendship friendship = new Friendship();
        friendship.setRequester(currentUser);
        friendship.setReceiver(otherUser);
        friendship.setStatus(FriendshipStatus.ACCEPTED);

        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.of(friendship));

        friendshipService.removeFriend(otherUser.getId());

        verify(friendshipRepository, times(1)).delete(friendship);
    }

    @Test
    void blockUser_ShouldCreateOrUpdateToBlocked() {
        when(userRepository.findById(otherUser.getId())).thenReturn(Optional.of(otherUser));
        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.empty());

        friendshipService.blockUser(otherUser.getId());

        verify(friendshipRepository, times(1)).save(any(Friendship.class));
    }

    @Test
    void unblockUser_ShouldDeleteBlockedRelation() {
        Friendship friendship = new Friendship();
        friendship.setRequester(currentUser);
        friendship.setReceiver(otherUser);
        friendship.setStatus(FriendshipStatus.BLOCKED);

        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.of(friendship));

        friendshipService.unblockUser(otherUser.getId());

        verify(friendshipRepository, times(1)).delete(friendship);
    }

    @Test
    void getFriends_ShouldReturnActiveFriendsList() {
        Friendship friendship = new Friendship();
        friendship.setRequester(currentUser);
        friendship.setReceiver(otherUser);
        friendship.setStatus(FriendshipStatus.ACCEPTED);

        when(friendshipRepository.findAllAcceptedFriendships(currentUser.getId()))
                .thenReturn(List.of(friendship));
        when(profileRepository.findByUserId(otherUser.getId())).thenReturn(Optional.of(otherProfile));

        List<SocialProfileResponseDTO> result = friendshipService.getFriends();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Outro Estudante", result.get(0).getName());
        assertEquals("ACCEPTED", result.get(0).getRelationshipStatus());
    }

    @Test
    void getPendingRequests_ShouldReturnPendingList() {
        Friendship friendship = new Friendship();
        friendship.setRequester(otherUser);
        friendship.setReceiver(currentUser);
        friendship.setStatus(FriendshipStatus.PENDING);

        when(friendshipRepository.findAllPendingRequestsReceived(currentUser.getId()))
                .thenReturn(List.of(friendship));
        when(profileRepository.findByUserId(otherUser.getId())).thenReturn(Optional.of(otherProfile));

        List<SocialProfileResponseDTO> result = friendshipService.getPendingRequests();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Outro Estudante", result.get(0).getName());
        assertEquals("PENDING", result.get(0).getRelationshipStatus());
    }

    @Test
    void getBlockedUsers_ShouldReturnBlockedList() {
        Friendship friendship = new Friendship();
        friendship.setRequester(currentUser);
        friendship.setReceiver(otherUser);
        friendship.setStatus(FriendshipStatus.BLOCKED);

        when(friendshipRepository.findAllBlockedRelationships(currentUser.getId()))
                .thenReturn(List.of(friendship));
        when(profileRepository.findByUserId(otherUser.getId())).thenReturn(Optional.of(otherProfile));

        List<SocialProfileResponseDTO> result = friendshipService.getBlockedUsers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Outro Estudante", result.get(0).getName());
        assertEquals("BLOCKED", result.get(0).getRelationshipStatus());
    }

    @Test
    void searchProfiles_ShouldReturnMaskedProfile_WhenTargetProfileIsPrivateAndNotFriends() {
        // Mark target profile private
        otherProfile.setIsPublic(false);

        when(profileRepository.searchProfiles("Outro", currentUser.getId()))
                .thenReturn(List.of(otherProfile));
        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.empty());
        when(studySessionRepository.findDistinctSessionDatesByUserId(otherUser.getId()))
                .thenReturn(List.of(LocalDate.now()));

        List<SocialProfileResponseDTO> result = friendshipService.searchProfiles("Outro");

        assertNotNull(result);
        assertEquals(1, result.size());
        SocialProfileResponseDTO res = result.get(0);
        assertEquals("Outro Estudante", res.getName());
        assertNull(res.getFaculdade()); // Masked because profile is private & not friends
        assertNull(res.getSemestre());
        assertEquals(0, res.getStreak()); // Zeroed streak
    }

    @Test
    void searchProfiles_ShouldReturnGranularMaskedProfile_WhenTargetProfileHasShareFieldsDisabled() {
        // Public profile but with specific sharing disabled
        otherProfile.setIsPublic(true);
        otherProfile.setShareFaculdade(false);
        otherProfile.setShareStreak(false);

        when(profileRepository.searchProfiles("Outro", currentUser.getId()))
                .thenReturn(List.of(otherProfile));
        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), otherUser.getId()))
                .thenReturn(Optional.empty());
        when(studySessionRepository.findDistinctSessionDatesByUserId(otherUser.getId()))
                .thenReturn(List.of(LocalDate.now()));

        List<SocialProfileResponseDTO> result = friendshipService.searchProfiles("Outro");

        assertNotNull(result);
        assertEquals(1, result.size());
        SocialProfileResponseDTO res = result.get(0);
        assertEquals("Outro Estudante", res.getName());
        assertNull(res.getFaculdade()); // Masked because shareFaculdade is false
        assertNull(res.getSemestre());
        assertNull(res.getStreak()); // Masked (null) because shareStreak is false
    }
}
