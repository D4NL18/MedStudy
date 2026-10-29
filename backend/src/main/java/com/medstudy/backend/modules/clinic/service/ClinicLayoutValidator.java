package com.medstudy.backend.modules.clinic.service;

import com.medstudy.backend.modules.clinic.dto.PlacedItemDto;
import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Spatial validator enforcing grid bounds and 2D AABB non-collision for floor items,
 * and linear wall slot non-collision for wall-mounted items (P-084, P-088).
 */
@Component
public class ClinicLayoutValidator {

    /**
     * Validates that all placed items (placed == true):
     * 1. Floor items fit within (gridWidth x gridHeight) and have zero 2D AABB overlap.
     * 2. Wall items are anchored only on NW/NE walls and do not collide on the same wall tile index.
     * 3. Wall items do not block or collide with floor items (0x0 floor footprint).
     */
    public void validateLayout(
            int gridWidth,
            int gridHeight,
            List<PlacedItemDto> items,
            Map<String, ClinicCatalogItem> catalogMap
    ) {
        if (items == null || items.isEmpty()) {
            return;
        }

        List<BoundingBox> floorBoxes = new ArrayList<>();
        Set<String> wallSlotsOccupied = new HashSet<>();

        for (PlacedItemDto item : items) {
            if (!item.isPlaced()) {
                continue;
            }

            ClinicCatalogItem catalogItem = catalogMap.get(item.getCatalogItemId());
            if (catalogItem == null) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "Item do catálogo inválido no layout: " + item.getCatalogItemId()
                );
            }

            String placementType = catalogItem.getPlacementType() != null
                    ? catalogItem.getPlacementType()
                    : (item.getPlacementType() != null ? item.getPlacementType() : "FLOOR");

            // Ignore surface themes (they apply to the entire room, not individual tiles)
            if (placementType.startsWith("SURFACE_")) {
                continue;
            }

            // Wall-mounted items validation (P-088)
            if ("WALL".equalsIgnoreCase(placementType) || item.getWallSide() != null) {
                String wallSide = item.getWallSide();
                if (wallSide == null || wallSide.isBlank()) {
                    // Default to NW if not explicitly set
                    wallSide = "NW";
                    item.setWallSide("NW");
                }
                wallSide = wallSide.toUpperCase();

                if (!"NW".equals(wallSide) && !"NE".equals(wallSide)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Itens de parede só podem ser fixados nas paredes traseiras (NW e NE)."
                    );
                }

                int maxWallTiles = "NW".equals(wallSide) ? gridWidth : gridHeight;
                int tileIndex = item.getWallTileIndex() != null ? item.getWallTileIndex() : (item.getGridX() != null ? item.getGridX() : 0);

                if (tileIndex < 0 || tileIndex >= maxWallTiles) {
                    throw new ResponseStatusException(
                            HttpStatus.UNPROCESSABLE_ENTITY,
                            String.format("Segmento de parede inválido (%d). Dimensão máxima da parede %s é %d.", tileIndex, wallSide, maxWallTiles)
                    );
                }

                String wallSlotKey = wallSide + ":" + tileIndex;
                if (wallSlotsOccupied.contains(wallSlotKey)) {
                    throw new ResponseStatusException(
                            HttpStatus.UNPROCESSABLE_ENTITY,
                            "Já existe um item de parede fixado neste segmento."
                    );
                }
                wallSlotsOccupied.add(wallSlotKey);

                // Wall items have 0x0 floor footprint; do not add to floorBoxes
                continue;
            }

            // Floor items validation (P-084)
            int rotation = item.getRotation();
            if (rotation != 0 && rotation != 1) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        "Rotação inválida para o item " + item.getCatalogItemId() + ": permitido apenas 0 ou 1."
                );
            }

            int effW = (rotation == 1) ? catalogItem.getFootprintY() : catalogItem.getFootprintX();
            int effH = (rotation == 1) ? catalogItem.getFootprintX() : catalogItem.getFootprintY();

            int gx = item.getGridX() != null ? item.getGridX() : 0;
            int gy = item.getGridY() != null ? item.getGridY() : 0;

            if (gx < 0 || gy < 0 || gx + effW > gridWidth || gy + effH > gridHeight) {
                throw new ResponseStatusException(
                        HttpStatus.UNPROCESSABLE_ENTITY,
                        String.format(
                                "Item '%s' em (%d, %d) com dimensão %dx%d extrapola os limites da malha (%dx%d).",
                                item.getCatalogItemId(), gx, gy, effW, effH, gridWidth, gridHeight
                        )
                );
            }

            BoundingBox currentBox = new BoundingBox(item.getCatalogItemId(), gx, gy, gx + effW, gy + effH);
            for (BoundingBox existing : floorBoxes) {
                if (currentBox.intersects(existing)) {
                    throw new ResponseStatusException(
                            HttpStatus.UNPROCESSABLE_ENTITY,
                            String.format(
                                    "Colisão AABB 2D detectada no piso entre '%s' e '%s'.",
                                    existing.catalogItemId, currentBox.catalogItemId
                            )
                    );
                }
            }
            floorBoxes.add(currentBox);
        }
    }

    public boolean canPlaceAt(
            int gridWidth,
            int gridHeight,
            int gridX,
            int gridY,
            int rotation,
            ClinicCatalogItem targetItem,
            List<PlacedItemDto> existingPlacedItems,
            Map<String, ClinicCatalogItem> catalogMap
    ) {
        List<PlacedItemDto> candidateList = new ArrayList<>(existingPlacedItems);
        PlacedItemDto candidate = new PlacedItemDto(null, targetItem.getId(), gridX, gridY, rotation, true);
        if ("WALL".equalsIgnoreCase(targetItem.getPlacementType())) {
            candidate.setWallSide("NW");
            candidate.setWallTileIndex(gridX);
            candidate.setElevationZ(45);
        }
        candidateList.add(candidate);
        try {
            validateLayout(gridWidth, gridHeight, candidateList, catalogMap);
            return true;
        } catch (ResponseStatusException ex) {
            return false;
        }
    }

    private record BoundingBox(String catalogItemId, int x1, int y1, int x2, int y2) {
        boolean intersects(BoundingBox other) {
            return this.x1 < other.x2 && this.x2 > other.x1 && this.y1 < other.y2 && this.y2 > other.y1;
        }
    }
}
