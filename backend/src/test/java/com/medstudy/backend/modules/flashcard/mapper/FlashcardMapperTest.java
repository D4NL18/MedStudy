package com.medstudy.backend.modules.flashcard.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.modules.flashcard.dto.FlashcardRequest;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FlashcardMapperTest {

    private FlashcardMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = Mappers.getMapper(FlashcardMapper.class);
        ReflectionTestUtils.setField(mapper, "objectMapper", new ObjectMapper());
    }

    @Test
    void toEntity_ShouldMapFields() {
        FlashcardRequest request = new FlashcardRequest("GO", "Q", "A");
        Flashcard entity = mapper.toEntity(request);
        
        assertNotNull(entity);
        assertEquals("GO", entity.getGrandeArea());
        assertEquals("Q", entity.getFrente().asText());
        assertEquals("A", entity.getVerso().asText());
    }

    @Test
    void updateEntity_ShouldModifyExisting() {
        Flashcard entity = new Flashcard();
        entity.setGrandeArea("Old");
        
        FlashcardRequest request = new FlashcardRequest("New", "Q", "A");
        mapper.updateEntity(request, entity);
        
        assertEquals("New", entity.getGrandeArea());
        assertEquals("Q", entity.getFrente().asText());
        assertEquals("A", entity.getVerso().asText());
    }

    @Test
    void toResponse_ShouldMapFields() {
        Flashcard entity = new Flashcard();
        entity.setId(UUID.randomUUID());
        entity.setGrandeArea("GO");
        entity.setFrente(new ObjectMapper().valueToTree("Q"));
        entity.setVerso(new ObjectMapper().valueToTree("A"));

        com.medstudy.backend.modules.flashcard.dto.FlashcardResponse response = mapper.toResponse(entity);

        assertNotNull(response);
        assertEquals(entity.getId(), response.getId());
        assertEquals("GO", response.getGrandeArea());
    }

    @Test
    void mapJsonNode_ShouldHandleNull() {
        // Test map(Object value)
        String value = "test";
        com.fasterxml.jackson.databind.JsonNode result1 = ReflectionTestUtils.invokeMethod(mapper, "map", value);
        assertNotNull(result1);

        // Test map(JsonNode node)
        com.fasterxml.jackson.databind.JsonNode node = com.fasterxml.jackson.databind.node.TextNode.valueOf("test");
        Object result2 = ReflectionTestUtils.invokeMethod(mapper, "map", node);
        assertNotNull(result2);
    }
}
