package com.medstudy.backend.modules.clinic.service;

import com.medstudy.backend.modules.clinic.dto.PlacedItemDto;
import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

class ClinicLayoutValidatorTest {

    private ClinicLayoutValidator validator;
    private Map<String, ClinicCatalogItem> catalogMap;

    @BeforeEach
    void setUp() {
        validator = new ClinicLayoutValidator();
        catalogMap = ClinicService.OFFICIAL_CATALOG_ITEMS.stream()
                .collect(Collectors.toMap(ClinicCatalogItem::getId, Function.identity()));
    }

    @Test
    @DisplayName("P-084: Starter kit layout in 4x4 grid should be valid without collisions")
    void shouldAcceptValidStarterKitLayoutIn4x4Grid() {
        List<PlacedItemDto> items = List.of(
                new PlacedItemDto(UUID.randomUUID(), "mesa_scandi", 0, 0, 0, true),       // 2x1 -> [0..2, 0..1)
                new PlacedItemDto(UUID.randomUUID(), "cadeira_ergonomica", 0, 1, 0, true), // 1x1 -> [0..1, 1..2)
                new PlacedItemDto(UUID.randomUUID(), "ped_maca_baleia", 2, 0, 0, true)     // 2x1 -> [2..4, 0..1)
        );

        assertDoesNotThrow(() -> validator.validateLayout(4, 4, items, catalogMap));
    }

    @Test
    @DisplayName("P-084: Should reject AABB 2D collision between two placed items")
    void shouldRejectOverlappingItemsOnFloor() {
        // mesa_scandi at (0,0) with rotation=0 occupies (0,0) and (1,0)
        // cadeira_ergonomica at (1,0) collides with the second tile of mesa_scandi
        List<PlacedItemDto> collidingItems = List.of(
                new PlacedItemDto(UUID.randomUUID(), "mesa_scandi", 0, 0, 0, true),
                new PlacedItemDto(UUID.randomUUID(), "cadeira_ergonomica", 1, 0, 0, true)
        );

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> validator.validateLayout(4, 4, collidingItems, catalogMap));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
    }

    @Test
    @DisplayName("P-084: Should invert footprintX and footprintY when rotation == 1")
    void shouldInvertFootprintWhenRotationIsOne() {
        // mesa_scandi has footprint 2x1.
        // At gridX=3, gridY=2 in a 4x4 grid:
        // - rotation=0 -> effW=2, effH=1 -> 3+2 = 5 > 4 (OUT OF BOUNDS)
        // - rotation=1 -> effW=1, effH=2 -> 3+1 = 4 <= 4 and 2+2 = 4 <= 4 (VALID)
        List<PlacedItemDto> overflowRotation0 = List.of(
                new PlacedItemDto(UUID.randomUUID(), "mesa_scandi", 3, 2, 0, true)
        );
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> validator.validateLayout(4, 4, overflowRotation0, catalogMap));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());

        List<PlacedItemDto> validRotation1 = List.of(
                new PlacedItemDto(UUID.randomUUID(), "mesa_scandi", 3, 2, 1, true)
        );
        assertDoesNotThrow(() -> validator.validateLayout(4, 4, validRotation1, catalogMap));
    }

    @Test
    @DisplayName("P-084: Should reject negative coordinates or items exceeding gridWidth/gridHeight")
    void shouldRejectOutOfBoundsCoordinates() {
        List<PlacedItemDto> negativeCoords = List.of(
                new PlacedItemDto(UUID.randomUUID(), "cadeira_ergonomica", -1, 0, 0, true)
        );
        assertThrows(ResponseStatusException.class,
                () -> validator.validateLayout(4, 4, negativeCoords, catalogMap));

        List<PlacedItemDto> overflow2x2 = List.of(
                new PlacedItemDto(UUID.randomUUID(), "ped_piscina_bolinhas", 3, 3, 0, true) // 2x2 at (3,3) in 4x4
        );
        assertThrows(ResponseStatusException.class,
                () -> validator.validateLayout(4, 4, overflow2x2, catalogMap));
    }

    @Test
    @DisplayName("P-084: Unplaced inventory items (placed = false) should not trigger floor collisions")
    void shouldIgnoreUnplacedInventoryItemsInCollisionCheck() {
        List<PlacedItemDto> items = List.of(
                new PlacedItemDto(UUID.randomUUID(), "mesa_scandi", 0, 0, 0, true),
                new PlacedItemDto(UUID.randomUUID(), "ped_maca_baleia", 0, 0, 0, false)
        );

        assertDoesNotThrow(() -> validator.validateLayout(4, 4, items, catalogMap));
    }

    @Test
    @DisplayName("P-088 / C-06: Wall-mounted item (ped_regua_girafa) should not collide with floor item (mesa_scandi) beneath it")
    void shouldAllowFloorItemBeneathWallItemWithoutCollision() {
        // mesa_scandi at (0,0) on the floor, and ped_regua_girafa mounted on NW wall at tile 0
        PlacedItemDto floorItem = new PlacedItemDto(UUID.randomUUID(), "mesa_scandi", 0, 0, 0, true);
        PlacedItemDto wallItem = new PlacedItemDto(
                UUID.randomUUID(), "ped_regua_girafa", "WALL",
                null, null, 0, "NW", 0, 45, true
        );

        assertDoesNotThrow(() -> validator.validateLayout(4, 4, List.of(floorItem, wallItem), catalogMap));
    }

    @Test
    @DisplayName("P-088 / C-07: Should reject two wall items occupying the exact same wall segment")
    void shouldRejectTwoWallItemsOnSameSegment() {
        PlacedItemDto wall1 = new PlacedItemDto(
                UUID.randomUUID(), "ped_regua_girafa", "WALL",
                null, null, 0, "NW", 2, 45, true
        );
        PlacedItemDto wall2 = new PlacedItemDto(
                UUID.randomUUID(), "negatoscopio_led", "WALL",
                null, null, 0, "NW", 2, 50, true
        );

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> validator.validateLayout(4, 4, List.of(wall1, wall2), catalogMap));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Já existe um item de parede fixado neste segmento"));
    }

    @Test
    @DisplayName("P-088: Should reject invalid wall side outside NW or NE")
    void shouldRejectInvalidWallSide() {
        PlacedItemDto wallInvalid = new PlacedItemDto(
                UUID.randomUUID(), "ped_regua_girafa", "WALL",
                null, null, 0, "SE", 1, 45, true
        );

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> validator.validateLayout(4, 4, List.of(wallInvalid), catalogMap));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }
}
