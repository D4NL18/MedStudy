package com.medstudy.backend.modules.competition.mapper;

import com.medstudy.backend.modules.competition.dto.CompetitionResponseDTO;
import com.medstudy.backend.modules.competition.entity.Competition;
import com.medstudy.backend.modules.competition.entity.CompetitionParticipant;
import com.medstudy.backend.modules.profile.entity.Profile;
import com.medstudy.backend.modules.profile.repository.ProfileRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
/** Mapper for converting between {@link Competition} entities and DTOs. */
public abstract class CompetitionMapper {

    @Autowired
    protected ProfileRepository profileRepository;

    @Mapping(source = "creator.id", target = "creatorId")
    @Mapping(source = "creator.name", target = "creatorName")
    @Mapping(source = "participants", target = "participants", qualifiedByName = "mapParticipants")
    public abstract CompetitionResponseDTO toDTO(Competition competition);

    public abstract List<CompetitionResponseDTO> toDTOs(List<Competition> competitions);

    @Named("mapParticipants")
    public List<CompetitionResponseDTO.ParticipantInfo> mapParticipants(List<CompetitionParticipant> participants) {
        if (participants == null) {
            return List.of();
        }
        return participants.stream().map(p -> {
            Profile profile = profileRepository.findByUserId(p.getUser().getId()).orElse(null);
            String handle = profile != null ? profile.getHandle() : "";
            String avatarPresetId = profile != null ? profile.getAvatarPresetId() : "default";
            return new CompetitionResponseDTO.ParticipantInfo(
                p.getUser().getId(),
                p.getUser().getName(),
                handle,
                avatarPresetId,
                p.getStatus(),
                p.getJoinedAt()
            );
        }).collect(Collectors.toList());
    }
}
