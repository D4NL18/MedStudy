package com.medstudy.backend.modules.flashcard.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.modules.flashcard.dto.FlashcardRequest;
import com.medstudy.backend.modules.flashcard.dto.FlashcardResponse;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class FlashcardMapper {

    @Autowired
    protected ObjectMapper objectMapper;

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "proximaRevisao", ignore = true)
    @Mapping(target = "dificuldadeUltima", ignore = true)
    @Mapping(target = "easeFactor", ignore = true)
    @Mapping(target = "intervaloAtual", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    public abstract Flashcard toEntity(FlashcardRequest request);

    public abstract FlashcardResponse toResponse(Flashcard entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "proximaRevisao", ignore = true)
    @Mapping(target = "dificuldadeUltima", ignore = true)
    @Mapping(target = "easeFactor", ignore = true)
    @Mapping(target = "intervaloAtual", ignore = true)
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

