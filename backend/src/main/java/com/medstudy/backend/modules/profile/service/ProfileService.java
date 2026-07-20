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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for managing user profiles.
 */
@Service
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private final UserRepository userRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final FriendshipRepository friendshipRepository;
    private final com.medstudy.backend.core.storage.StorageService storageService;

    /**
     * Constructs a new ProfileService.
     *
     * @param profileRepository the profile repository
     * @param profileMapper the profile mapper
     * @param userRepository the user repository
     * @param studySessionRepository the study session repository
     * @param userBadgeRepository the user badge repository
     * @param friendshipRepository the friendship repository
     */
    public ProfileService(ProfileRepository profileRepository,
                          ProfileMapper profileMapper,
                          UserRepository userRepository,
                          StudySessionRepository studySessionRepository,
                          UserBadgeRepository userBadgeRepository,
                          FriendshipRepository friendshipRepository,
                          com.medstudy.backend.core.storage.StorageService storageService) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
        this.userRepository = userRepository;
        this.studySessionRepository = studySessionRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.friendshipRepository = friendshipRepository;
        this.storageService = storageService;
    }

    private User getCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        return null;
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
            if (java.time.temporal.ChronoUnit.DAYS.between(dates.get(i+1), dates.get(i)) == 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    private ProfileDTO enrichAndMaskProfile(Profile profile, UUID viewerId) {
        ProfileDTO dto = profileMapper.toDTO(profile);
        UUID ownerId = profile.getUser().getId();

        int actualStreak = calculateStreak(ownerId);
        Long totalQ = studySessionRepository.sumTotalQuestionsByUserId(ownerId);
        long actualTotalQuestions = totalQ != null ? totalQ : 0L;
        List<String> actualBadges = userBadgeRepository.findAllByUserId(ownerId).stream()
                .map(ub -> ub.getBadgeType().name())
                .collect(Collectors.toList());

        if (viewerId != null && viewerId.equals(ownerId)) {
            dto.setStreak(actualStreak);
            dto.setTotalQuestions(actualTotalQuestions);
            dto.setBadges(actualBadges);
            dto.setIsPrivate(false);
            dto.setFriendshipStatus("NONE");
            dto.setIsRequester(false);
            return dto;
        }

        String friendshipStatus = "NONE";
        boolean isRequester = false;

        if (viewerId != null) {
            Optional<Friendship> relationOpt = friendshipRepository.findFriendshipBetween(viewerId, ownerId);
            if (relationOpt.isPresent()) {
                Friendship friendship = relationOpt.get();
                friendshipStatus = friendship.getStatus().name();
                isRequester = friendship.getRequester().getId().equals(viewerId);
            }
        }

        dto.setFriendshipStatus(friendshipStatus);
        dto.setIsRequester(isRequester);

        boolean isFriend = "ACCEPTED".equals(friendshipStatus);

        if (Boolean.FALSE.equals(profile.getIsPublic()) && !isFriend) {
            dto.setIsPrivate(true);
            dto.setFaculdade(null);
            dto.setSemestre(null);
            dto.setIsFormado(null);
            dto.setStreak(0);
            dto.setTotalQuestions(0L);
            dto.setBadges(new ArrayList<>());
        } else {
            dto.setIsPrivate(false);

            if (!Boolean.TRUE.equals(profile.getShareFaculdade())) {
                dto.setFaculdade(null);
                dto.setSemestre(null);
                dto.setIsFormado(null);
            }

            if (Boolean.TRUE.equals(profile.getShareStreak())) {
                dto.setStreak(actualStreak);
            } else {
                dto.setStreak(null);
            }

            if (Boolean.TRUE.equals(profile.getShareTotalQuestions())) {
                dto.setTotalQuestions(actualTotalQuestions);
            } else {
                dto.setTotalQuestions(null);
            }

            if (Boolean.TRUE.equals(profile.getShareBadges())) {
                dto.setBadges(actualBadges);
            } else {
                dto.setBadges(new ArrayList<>());
            }
        }

        return dto;
    }

    /**
     * Gets a profile by user ID.
     *
     * @param userId the user ID
     * @return an Optional containing the profile data, or empty if not found
     */
    @Transactional(readOnly = true)
    public Optional<ProfileDTO> getProfileByUserId(UUID userId) {
        return profileRepository.findByUserId(userId)
                .map(profile -> enrichAndMaskProfile(profile, userId));
    }

    /**
     * Gets a profile by handle.
     *
     * @param handle the profile handle
     * @return an Optional containing the profile data, or empty if not found
     */
    @Transactional(readOnly = true)
    public Optional<ProfileDTO> getProfileByHandle(String handle) {
        User viewer = getCurrentUser();
        UUID viewerId = viewer != null ? viewer.getId() : null;
        return profileRepository.findByHandle(handle)
                .map(profile -> enrichAndMaskProfile(profile, viewerId));
    }

    /**
     * Checks if a profile handle is available for the given user.
     *
     * @param handle the handle to check
     * @param currentUserId the current user ID
     * @return true if the handle is available, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isHandleAvailable(String handle, UUID currentUserId) {
        if (currentUserId == null) {
            return !profileRepository.existsByHandle(handle);
        }
        return !profileRepository.existsByHandleAndUserIdNot(handle, currentUserId);
    }

    /**
     * Creates or updates a profile for the specified user.
     *
     * @param dto the profile data
     * @param user the authenticated user
     * @return the saved profile data
     */
    public ProfileDTO createOrUpdateProfile(ProfileDTO dto, User user) {
        if (!isHandleAvailable(dto.getHandle(), user.getId())) {
            throw new IllegalArgumentException("O handle '" + dto.getHandle() + "' já está em uso.");
        }

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Profile p = new Profile();
                    p.setUser(user);
                    return p;
                });

        profile.setHandle(dto.getHandle());
        profile.setNomeCompleto(dto.getNomeCompleto());
        
        if (Boolean.TRUE.equals(dto.getIsFormado())) {
            profile.setIsFormado(true);
            profile.setSemestre(null);
        } else {
            if (dto.getSemestre() == null) {
                throw new IllegalArgumentException("O semestre é obrigatório quando não é formado.");
            }
            profile.setIsFormado(false);
            profile.setSemestre(dto.getSemestre());
        }
        profile.setFaculdade(dto.getFaculdade());
        profile.setAvatarPresetId(dto.getAvatarPresetId());

        if (dto.getIsPublic() != null) {
            profile.setIsPublic(dto.getIsPublic());
        }
        if (dto.getShareStreak() != null) {
            profile.setShareStreak(dto.getShareStreak());
        }
        if (dto.getShareFaculdade() != null) {
            profile.setShareFaculdade(dto.getShareFaculdade());
        }
        if (dto.getShareTotalQuestions() != null) {
            profile.setShareTotalQuestions(dto.getShareTotalQuestions());
        }
        if (dto.getShareBadges() != null) {
            profile.setShareBadges(dto.getShareBadges());
        }

        Profile saved = profileRepository.save(profile);
        return enrichAndMaskProfile(saved, user.getId());
    }

    /**
     * Uploads and updates the profile picture.
     */
    public ProfileDTO uploadProfilePicture(UUID userId, org.springframework.web.multipart.MultipartFile file) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        try {
            java.io.InputStream processedImage = com.medstudy.backend.core.utils.ImageUtils.validateAndProcessImage(file);
            String fileName = userId.toString() + "-" + java.util.UUID.randomUUID().toString() + ".jpg";
            String publicUrl = storageService.uploadImage(fileName, processedImage);
            
            profile.setProfilePictureUrl(publicUrl);
            Profile saved = profileRepository.save(profile);
            return enrichAndMaskProfile(saved, userId);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Error processing profile picture", e);
        }
    }
}
