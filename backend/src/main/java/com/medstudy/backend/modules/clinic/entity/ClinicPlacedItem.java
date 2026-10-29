package com.medstudy.backend.modules.clinic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity for clinic_placed_items representing owned items placed on the grid or stored in inventory (P-084).
 */
@Entity
@Table(name = "clinic_placed_items")
public class ClinicPlacedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "clinic_id", nullable = false)
    private UUID clinicId;

    @Column(name = "catalog_item_id", length = 50, nullable = false)
    private String catalogItemId;

    @Column(name = "grid_x", nullable = false)
    private int gridX = 0;

    @Column(name = "grid_y", nullable = false)
    private int gridY = 0;

    @Column(name = "rotation", nullable = false)
    private int rotation = 0;

    @Column(name = "is_placed", nullable = false)
    private boolean isPlaced = true;

    @Column(name = "wall_side", length = 2)
    private String wallSide;

    @Column(name = "wall_tile_index")
    private Integer wallTileIndex;

    @Column(name = "elevation_z")
    private Integer elevationZ;

    @Column(name = "placed_at", nullable = false)
    private LocalDateTime placedAt = LocalDateTime.now();

    public ClinicPlacedItem() {
    }

    public ClinicPlacedItem(UUID clinicId, String catalogItemId, int gridX, int gridY, int rotation, boolean isPlaced) {
        this.clinicId = clinicId;
        this.catalogItemId = catalogItemId;
        this.gridX = gridX;
        this.gridY = gridY;
        this.rotation = rotation;
        this.isPlaced = isPlaced;
        this.placedAt = LocalDateTime.now();
    }

    public ClinicPlacedItem(UUID clinicId, String catalogItemId, String wallSide, Integer wallTileIndex, Integer elevationZ, boolean isPlaced) {
        this.clinicId = clinicId;
        this.catalogItemId = catalogItemId;
        this.gridX = 0;
        this.gridY = 0;
        this.rotation = 0;
        this.wallSide = wallSide;
        this.wallTileIndex = wallTileIndex;
        this.elevationZ = elevationZ;
        this.isPlaced = isPlaced;
        this.placedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getClinicId() {
        return clinicId;
    }

    public void setClinicId(UUID clinicId) {
        this.clinicId = clinicId;
    }

    public String getCatalogItemId() {
        return catalogItemId;
    }

    public void setCatalogItemId(String catalogItemId) {
        this.catalogItemId = catalogItemId;
    }

    public int getGridX() {
        return gridX;
    }

    public void setGridX(int gridX) {
        this.gridX = gridX;
    }

    public int getGridY() {
        return gridY;
    }

    public void setGridY(int gridY) {
        this.gridY = gridY;
    }

    public int getRotation() {
        return rotation;
    }

    public void setRotation(int rotation) {
        this.rotation = rotation;
    }

    public boolean isPlaced() {
        return isPlaced;
    }

    public void setPlaced(boolean placed) {
        isPlaced = placed;
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

    public LocalDateTime getPlacedAt() {
        return placedAt;
    }

    public void setPlacedAt(LocalDateTime placedAt) {
        this.placedAt = placedAt;
    }
}
