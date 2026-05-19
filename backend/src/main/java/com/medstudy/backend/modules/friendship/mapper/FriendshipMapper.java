package com.medstudy.backend.modules.friendship.mapper;

import com.medstudy.backend.modules.friendship.dto.FriendshipResponseDTO;
import com.medstudy.backend.modules.friendship.entity.Friendship;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FriendshipMapper {

    @Mapping(source = "requester.id", target = "requesterId")
    @Mapping(source = "receiver.id", target = "receiverId")
    FriendshipResponseDTO toDTO(Friendship entity);
}
