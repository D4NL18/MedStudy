package com.medstudy.backend.modules.clinic.dto;

import jakarta.validation.constraints.Size;

/**
 * DTO for updating active clinic surface themes (P-087).
 */
public class ClinicSurfacesUpdateRequest {

    @Size(max = 50, message = "O identificador do tema de parede deve ter no máximo 50 caracteres.")
    private String wallTheme;

    @Size(max = 50, message = "O identificador do tema de piso deve ter no máximo 50 caracteres.")
    private String floorTheme;

    public ClinicSurfacesUpdateRequest() {
    }

    public ClinicSurfacesUpdateRequest(String wallTheme, String floorTheme) {
        this.wallTheme = wallTheme;
        this.floorTheme = floorTheme;
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
}
