package com.medstudy.backend.modules.flashcard.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.modules.flashcard.dto.FlashcardRequest;
import com.medstudy.backend.modules.flashcard.dto.FlashcardResponse;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
/** Mapper for converting between {@link Flashcard} entities and DTOs. */
public abstract class FlashcardMapper {

    @Autowired
    protected ObjectMapper objectMapper;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public abstract Flashcard toEntity(FlashcardRequest request);

    @Mapping(target = "bountyCard", ignore = true)
    public abstract FlashcardResponse toResponse(Flashcard entity);

    @org.mapstruct.AfterMapping
    protected void setBountyCard(Flashcard entity, @MappingTarget FlashcardResponse response) {
        if (entity != null) {
            boolean isHardCount = entity.getConsecutiveHardCount() != null && entity.getConsecutiveHardCount() >= 2;
            boolean isLowEase = entity.getEaseFactor() != null && entity.getEaseFactor() < 1.7;
            response.setBountyCard(isHardCount || isLowEase);
        }
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public abstract void updateEntity(FlashcardRequest request, @MappingTarget Flashcard entity);

    protected JsonNode map(Object value) {
        return objectMapper.valueToTree(value);
    }

    protected Object map(JsonNode node) {
        if (node == null) return null;
        try {
            return objectMapper.treeToValue(node, Object.class);
        } catch (Exception e) {
            return node;
        }
    }
}
