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
 * JPA Entity for user_clinics representing the student's 2.5D isometric medical clinic (P-082).
 */
@Entity
@Table(name = "user_clinics")
public class UserClinic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "clinic_name", nullable = false, length = 100)
    private String clinicName = "Minha Clínica";

    @Column(name = "expansion_level", nullable = false)
    private int expansionLevel = 1;

    @Column(name = "grid_width", nullable = false)
    private int gridWidth = 4;

    @Column(name = "grid_height", nullable = false)
    private int gridHeight = 4;

    @Column(name = "theme", nullable = false, length = 50)
    private String theme = "clean_modern";

    @Column(name = "wall_theme", nullable = false, length = 50)
    private String wallTheme = "wall_clean_white";

    @Column(name = "floor_theme", nullable = false, length = 50)
    private String floorTheme = "floor_porcelanato_cinza";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserClinic() {
    }

    public UserClinic(UUID userId, String clinicName, int expansionLevel, int gridWidth, int gridHeight, String theme) {
        this.userId = userId;
        this.clinicName = clinicName != null ? clinicName : "Minha Clínica";
        this.expansionLevel = expansionLevel;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.theme = theme != null ? theme : "clean_modern";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public int getExpansionLevel() {
        return expansionLevel;
    }

    public void setExpansionLevel(int expansionLevel) {
        this.expansionLevel = expansionLevel;
    }

    public int getGridWidth() {
        return gridWidth;
    }

    public void setGridWidth(int gridWidth) {
        this.gridWidth = gridWidth;
    }

    public int getGridHeight() {
        return gridHeight;
    }

    public void setGridHeight(int gridHeight) {
        this.gridHeight = gridHeight;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getWallTheme() {
        return wallTheme;
    }

    public void setWallTheme(String wallTheme) {
        this.wallTheme = wallTheme;
    }

    public String getFloorTheme() {
        return floorTheme;
    }

    public void setFloorTheme(String floorTheme) {
        this.floorTheme = floorTheme;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
