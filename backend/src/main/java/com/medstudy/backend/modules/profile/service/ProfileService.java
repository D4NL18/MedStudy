package com.medstudy.backend.modules.profile.service;

import com.medstudy.backend.modules.profile.dto.ProfileDTO;
import com.medstudy.backend.modules.profile.entity.Profile;
import com.medstudy.backend.modules.profile.mapper.ProfileMapper;
import com.medstudy.backend.modules.profile.repository.ProfileRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, ProfileMapper profileMapper, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Optional<ProfileDTO> getProfileByUserId(UUID userId) {
        return profileRepository.findByUserId(userId)
                .map(profileMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<ProfileDTO> getProfileByHandle(String handle) {
        return profileRepository.findByHandle(handle)
                .map(profileMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public boolean isHandleAvailable(String handle, UUID currentUserId) {
        if (currentUserId == null) {
            return !profileRepository.existsByHandle(handle);
        }
        return !profileRepository.existsByHandleAndUserIdNot(handle, currentUserId);
    }

    public ProfileDTO createOrUpdateProfile(ProfileDTO dto, User user) {
        // Validate handle uniqueness
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

        Profile saved = profileRepository.save(profile);
        return profileMapper.toDTO(saved);
    }
}
