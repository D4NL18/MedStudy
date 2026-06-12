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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for managing friendships and social interactions between users.
 */
@Service
@Transactional
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final StudySessionRepository studySessionRepository;
    private final NotificationService notificationService;

    /**
     * Constructs a FriendshipService with the specified dependencies.
     *
     * @param friendshipRepository   the friendship repository
     * @param userRepository         the user repository
     * @param profileRepository      the profile repository
     * @param studySessionRepository the study session repository
     * @param notificationService    the notification service
     */
    public FriendshipService(FriendshipRepository friendshipRepository,
                             UserRepository userRepository,
                             ProfileRepository profileRepository,
                             StudySessionRepository studySessionRepository,
                             NotificationService notificationService) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.studySessionRepository = studySessionRepository;
        this.notificationService = notificationService;
    }

    private User getCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new RuntimeException("Sessão expirada ou usuário não autenticado");
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        throw new RuntimeException("Usuário não autenticado");
    }

    private int calculateStreak(UUID userId) {
        List<LocalDate> dates = studySessionRepository.findDistinctSessionDatesByUserId(userId);
        if (dates.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (!dates.get(0).equals(today) && !dates.get(0).equals(yesterday)) {
            return 0;
        }

        int streak = 1;
        for (int i = 0; i < dates.size() - 1; i++) {
            if (ChronoUnit.DAYS.between(dates.get(i+1), dates.get(i)) == 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    /**
     * Searches for user profiles matching the given query string.
     *
     * @param query the search query
     * @return a list of matching social profiles
     */
    @Transactional(readOnly = true)
    public List<SocialProfileResponseDTO> searchProfiles(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ArrayList<>();
        }
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        List<Profile> matchedProfiles = profileRepository.searchProfiles(query.trim(), currentUserId);

        return matchedProfiles.stream()
                .map(profile -> {
                    UUID otherUserId = profile.getUser().getId();
                    Optional<Friendship> relationOpt = friendshipRepository.findFriendshipBetween(currentUserId, otherUserId);

                    String relationshipStatus = "NONE";
                    Boolean isRequester = false;

                    if (relationOpt.isPresent()) {
                        Friendship friendship = relationOpt.get();
                        relationshipStatus = friendship.getStatus().name();
                        isRequester = friendship.getRequester().getId().equals(currentUserId);

                        if (friendship.getStatus() == FriendshipStatus.BLOCKED && !isRequester) {
                            return null;
                        }
                    }

                    int streak = calculateStreak(otherUserId);
                    boolean isFriend = "ACCEPTED".equals(relationshipStatus);
                    
                    String faculdade = profile.getFaculdade();
                    Integer semestre = profile.getSemestre();
                    Boolean isFormado = profile.getIsFormado();
                    Integer finalStreak = streak;

                    if (Boolean.FALSE.equals(profile.getIsPublic()) && !isFriend) {
                        faculdade = null;
                        semestre = null;
                        isFormado = null;
                        finalStreak = 0;
                    } else {
                        if (Boolean.FALSE.equals(profile.getShareFaculdade())) {
                            faculdade = null;
                            semestre = null;
                            isFormado = null;
                        }
                        if (Boolean.FALSE.equals(profile.getShareStreak())) {
                            finalStreak = null;
                        }
                    }

                    return new SocialProfileResponseDTO(
                            otherUserId,
                            profile.getNomeCompleto(),
                            profile.getHandle(),
                            faculdade,
                            semestre,
                            profile.getAvatarPresetId(),
                            isFormado,
                            relationshipStatus,
                            isRequester,
                            finalStreak
                    );
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    /**
     * Sends a friend request to a specified user.
     *
     * @param receiverId the UUID of the user to send the request to
     */
    public void sendFriendRequest(UUID receiverId) {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        if (receiverId.equals(currentUserId)) {
            throw new IllegalArgumentException("Você não pode enviar solicitação de amizade para si mesmo");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Usuário destinatário não encontrado"));

        Optional<Friendship> relationOpt = friendshipRepository.findFriendshipBetween(currentUserId, receiverId);

        if (relationOpt.isPresent()) {
            Friendship friendship = relationOpt.get();
            if (friendship.getStatus() == FriendshipStatus.ACCEPTED) {
                throw new IllegalStateException("Vocês já são amigos");
            } else if (friendship.getStatus() == FriendshipStatus.PENDING) {
                throw new IllegalStateException("Solicitação de amizade já enviada ou pendente");
            } else if (friendship.getStatus() == FriendshipStatus.BLOCKED) {
                throw new IllegalStateException("Usuário bloqueado");
            }
        }

        Friendship friendship = new Friendship();
        friendship.setRequester(currentUser);
        friendship.setReceiver(receiver);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendshipRepository.save(friendship);

        Profile currentProfile = profileRepository.findByUserId(currentUserId).orElse(null);
        String senderName = currentProfile != null ? currentProfile.getNomeCompleto() : currentUser.getName();

        notificationService.createNotification(
                receiver,
                currentUser,
                "FRIEND_REQUEST",
                senderName + " te enviou uma solicitação de amizade!"
        );
    }

    /**
     * Accepts a pending friend request from a specified user.
     *
     * @param requesterId the UUID of the user who sent the request
     */
    public void acceptFriendRequest(UUID requesterId) {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        Friendship friendship = friendshipRepository.findFriendshipBetween(currentUserId, requesterId)
                .orElseThrow(() -> new RuntimeException("Solicitação de amizade não encontrada"));

        if (friendship.getStatus() != FriendshipStatus.PENDING || 
            !friendship.getReceiver().getId().equals(currentUserId)) {
            throw new IllegalStateException("Nenhuma solicitação de amizade pendente para aceitar");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);

        User requester = friendship.getRequester();
        Profile currentProfile = profileRepository.findByUserId(currentUserId).orElse(null);
        String accepterName = currentProfile != null ? currentProfile.getNomeCompleto() : currentUser.getName();

        notificationService.createNotification(
                requester,
                currentUser,
                "FRIEND_ACCEPTED",
                accepterName + " aceitou sua solicitação de amizade!"
        );
    }

    /**
     * Declines a pending friend request from a specified user.
     *
     * @param requesterId the UUID of the user who sent the request
     */
    public void declineFriendRequest(UUID requesterId) {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        Friendship friendship = friendshipRepository.findFriendshipBetween(currentUserId, requesterId)
                .orElseThrow(() -> new RuntimeException("Solicitação de amizade não encontrada"));

        if (friendship.getStatus() != FriendshipStatus.PENDING || 
            !friendship.getReceiver().getId().equals(currentUserId)) {
            throw new IllegalStateException("Nenhuma solicitação de amizade pendente para recusar");
        }

        friendshipRepository.delete(friendship);
    }

    /**
     * Removes an existing friend from the current user's friend list.
     *
     * @param friendId the UUID of the friend to remove
     */
    public void removeFriend(UUID friendId) {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        Friendship friendship = friendshipRepository.findFriendshipBetween(currentUserId, friendId)
                .orElseThrow(() -> new RuntimeException("Conexão não encontrada"));

        if (friendship.getStatus() != FriendshipStatus.ACCEPTED) {
            throw new IllegalStateException("Você não é amigo deste usuário");
        }

        friendshipRepository.delete(friendship);
    }

    /**
     * Blocks a specified user, preventing further interactions.
     *
     * @param targetUserId the UUID of the user to block
     */
    public void blockUser(UUID targetUserId) {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        if (targetUserId.equals(currentUserId)) {
            throw new IllegalArgumentException("Você não pode bloquear a si mesmo");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Optional<Friendship> relationOpt = friendshipRepository.findFriendshipBetween(currentUserId, targetUserId);

        Friendship friendship;
        if (relationOpt.isPresent()) {
            friendship = relationOpt.get();
        } else {
            friendship = new Friendship();
        }

        friendship.setRequester(currentUser);
        friendship.setReceiver(targetUser);
        friendship.setStatus(FriendshipStatus.BLOCKED);
        friendshipRepository.save(friendship);
    }

    /**
     * Unblocks a previously blocked user.
     *
     * @param targetUserId the UUID of the user to unblock
     */
    public void unblockUser(UUID targetUserId) {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        Friendship friendship = friendshipRepository.findFriendshipBetween(currentUserId, targetUserId)
                .orElseThrow(() -> new RuntimeException("Bloqueio não encontrado"));

        if (friendship.getStatus() != FriendshipStatus.BLOCKED || 
            !friendship.getRequester().getId().equals(currentUserId)) {
            throw new IllegalStateException("Você não bloqueou este usuário");
        }

        friendshipRepository.delete(friendship);
    }

    /**
     * Retrieves the list of friends for the currently authenticated user.
     *
     * @return a list of the user's friends
     */
    @Transactional(readOnly = true)
    public List<SocialProfileResponseDTO> getFriends() {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        List<Friendship> activeFriendships = friendshipRepository.findAllAcceptedFriendships(currentUserId);

        return activeFriendships.stream()
                .map(friendship -> {
                    User friendUser = friendship.getRequester().getId().equals(currentUserId) 
                            ? friendship.getReceiver() 
                            : friendship.getRequester();
                    
                    Profile friendProfile = profileRepository.findByUserId(friendUser.getId()).orElse(null);
                    if (friendProfile == null) {
                        return null;
                    }

                    int streak = calculateStreak(friendUser.getId());
                    
                    String faculdade = friendProfile.getFaculdade();
                    Integer semestre = friendProfile.getSemestre();
                    Boolean isFormado = friendProfile.getIsFormado();
                    Integer finalStreak = streak;

                    if (Boolean.FALSE.equals(friendProfile.getShareFaculdade())) {
                        faculdade = null;
                        semestre = null;
                        isFormado = null;
                    }
                    if (Boolean.FALSE.equals(friendProfile.getShareStreak())) {
                        finalStreak = null;
                    }

                    return new SocialProfileResponseDTO(
                            friendUser.getId(),
                            friendProfile.getNomeCompleto(),
                            friendProfile.getHandle(),
                            faculdade,
                            semestre,
                            friendProfile.getAvatarPresetId(),
                            isFormado,
                            "ACCEPTED",
                            friendship.getRequester().getId().equals(currentUserId),
                            finalStreak
                    );
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves the list of pending friend requests for the currently authenticated user.
     *
     * @return a list of pending friend requests
     */
    @Transactional(readOnly = true)
    public List<SocialProfileResponseDTO> getPendingRequests() {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        List<Friendship> pendingRequests = friendshipRepository.findAllPendingRequestsReceived(currentUserId);

        return pendingRequests.stream()
                .map(friendship -> {
                    User requester = friendship.getRequester();
                    Profile requesterProfile = profileRepository.findByUserId(requester.getId()).orElse(null);
                    if (requesterProfile == null) {
                        return null;
                    }

                    int streak = calculateStreak(requester.getId());
                    boolean isFriend = false;
                    
                    String faculdade = requesterProfile.getFaculdade();
                    Integer semestre = requesterProfile.getSemestre();
                    Boolean isFormado = requesterProfile.getIsFormado();
                    Integer finalStreak = streak;

                    if (Boolean.FALSE.equals(requesterProfile.getIsPublic()) && !isFriend) {
                        faculdade = null;
                        semestre = null;
                        isFormado = null;
                        finalStreak = 0;
                    } else {
                        if (Boolean.FALSE.equals(requesterProfile.getShareFaculdade())) {
                            faculdade = null;
                            semestre = null;
                            isFormado = null;
                        }
                        if (Boolean.FALSE.equals(requesterProfile.getShareStreak())) {
                            finalStreak = null;
                        }
                    }

                    return new SocialProfileResponseDTO(
                            requester.getId(),
                            requesterProfile.getNomeCompleto(),
                            requesterProfile.getHandle(),
                            faculdade,
                            semestre,
                            requesterProfile.getAvatarPresetId(),
                            isFormado,
                            "PENDING",
                            false,
                            finalStreak
                    );
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves the list of users blocked by the currently authenticated user.
     *
     * @return a list of blocked users
     */
    @Transactional(readOnly = true)
    public List<SocialProfileResponseDTO> getBlockedUsers() {
        User currentUser = getCurrentUser();
        UUID currentUserId = currentUser.getId();

        List<Friendship> blockedRelations = friendshipRepository.findAllBlockedRelationships(currentUserId);

        return blockedRelations.stream()
                .filter(friendship -> friendship.getRequester().getId().equals(currentUserId))
                .map(friendship -> {
                    User blockedUser = friendship.getReceiver();
                    Profile blockedProfile = profileRepository.findByUserId(blockedUser.getId()).orElse(null);
                    if (blockedProfile == null) {
                        return null;
                    }

                    int streak = calculateStreak(blockedUser.getId());

                    return new SocialProfileResponseDTO(
                            blockedUser.getId(),
                            blockedProfile.getNomeCompleto(),
                            blockedProfile.getHandle(),
                            blockedProfile.getFaculdade(),
                            blockedProfile.getSemestre(),
                            blockedProfile.getAvatarPresetId(),
                            blockedProfile.getIsFormado(),
                            "BLOCKED",
                            true,
                            streak
                    );
                })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }
}
