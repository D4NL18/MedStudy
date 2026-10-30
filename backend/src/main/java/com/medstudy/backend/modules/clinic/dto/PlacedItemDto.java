package com.medstudy.backend.modules.clinic.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.medstudy.backend.modules.clinic.entity.ClinicPlacedItem;

import java.util.UUID;

/**
 * DTO representing an item owned by the student, either placed on the grid/wall or stored in inventory (P-084, P-088).
 */
public class PlacedItemDto {

    private UUID id;
    private String catalogItemId;
    private String placementType = "FLOOR"; // 'FLOOR', 'WALL', 'SURFACE_WALL', 'SURFACE_FLOOR'
    private Integer gridX = 0;
    private Integer gridY = 0;
    private int rotation = 0;
    private String wallSide; // 'NW' or 'NE'
    private Integer wallTileIndex;
    private Integer elevationZ;

    @JsonAlias({"placed", "isPlaced"})
    private boolean placed = true;

    public PlacedItemDto() {
    }

    public PlacedItemDto(UUID id, String catalogItemId, Integer gridX, Integer gridY, int rotation, boolean placed) {
        this.id = id;
        this.catalogItemId = catalogItemId;
        this.placementType = "FLOOR";
        this.gridX = gridX != null ? gridX : 0;
        this.gridY = gridY != null ? gridY : 0;
        this.rotation = rotation;
        this.placed = placed;
    }

    public PlacedItemDto(
            UUID id,
            String catalogItemId,
            String placementType,
            Integer gridX,
            Integer gridY,
            int rotation,
            String wallSide,
            Integer wallTileIndex,
            Integer elevationZ,
            boolean placed
    ) {
        this.id = id;
        this.catalogItemId = catalogItemId;
        this.placementType = placementType != null ? placementType : "FLOOR";
        this.gridX = gridX;
        this.gridY = gridY;
        this.rotation = rotation;
        this.wallSide = wallSide;
        this.wallTileIndex = wallTileIndex;
        this.elevationZ = elevationZ;
        this.placed = placed;
    }

    public static PlacedItemDto fromEntity(ClinicPlacedItem entity) {
        return new PlacedItemDto(
                entity.getId(),
                entity.getCatalogItemId(),
                entity.getWallSide() != null ? "WALL" : "FLOOR",
                entity.getGridX(),
                entity.getGridY(),
                entity.getRotation(),
                entity.getWallSide(),
                entity.getWallTileIndex(),
                entity.getElevationZ(),
                entity.isPlaced()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    @com.fasterxml.jackson.annotation.JsonSetter("id")
    public void setIdFromJson(Object rawId) {
        if (rawId == null) {
            this.id = null;
            return;
        }
        if (rawId instanceof UUID) {
            this.id = (UUID) rawId;
            return;
        }
        String str = rawId.toString().trim();
        if (str.isBlank()) {
            this.id = null;
            return;
        }
        try {
            this.id = UUID.fromString(str);
        } catch (IllegalArgumentException e) {
            // Client temporary ID (e.g. "placed-xxx-12345") is safely mapped to null
            // allowing ClinicService to resolve the owned entity by catalogItemId
            this.id = null;
        }
    }

    public String getCatalogItemId() {
        return catalogItemId;
    }

    public void setCatalogItemId(String catalogItemId) {
        this.catalogItemId = catalogItemId;
    }

    public String getPlacementType() {
        return placementType;
    }

    public void setPlacementType(String placementType) {
        this.placementType = placementType;
    }

    public Integer getGridX() {
        return gridX;
    }

    public void setGridX(Integer gridX) {
        this.gridX = gridX;
    }

    public Integer getGridY() {
        return gridY;
    }

    public void setGridY(Integer gridY) {
        this.gridY = gridY;
    }

    public int getRotation() {
        return rotation;
    }

    public void setRotation(int rotation) {
        this.rotation = rotation;
    }

    public String getWallSide() {
        return wallSide;
    }

    public void setWallSide(String wallSide) {
        this.wallSide = wallSide;
    }

    public Integer getWallTileIndex() {
        return wallTileIndex;
    }

    public void setWallTileIndex(Integer wallTileIndex) {
        this.wallTileIndex = wallTileIndex;
    }

    public Integer getElevationZ() {
        return elevationZ;
    }

    public void setElevationZ(Integer elevationZ) {
        this.elevationZ = elevationZ;
    }

    @JsonProperty("placed")
    public boolean isPlaced() {
        return placed;
    }

    @JsonProperty("isPlaced")
    public boolean getIsPlaced() {
        return placed;
    }

    public void setPlaced(boolean placed) {
        this.placed = placed;
    }

    public void setIsPlaced(boolean placed) {
        this.placed = placed;
    }
}
