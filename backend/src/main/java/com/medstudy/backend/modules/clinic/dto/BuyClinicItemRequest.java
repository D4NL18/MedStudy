package com.medstudy.backend.modules.clinic.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for purchasing an item from the official clinic catalog (P-083, P-084).
 */
public class BuyClinicItemRequest {

    @NotBlank(message = "O identificador do item do catálogo é obrigatório.")
    private String catalogItemId;

    private Integer gridX;
    private Integer gridY;
    private Integer rotation = 0;

    public BuyClinicItemRequest() {
    }

    public BuyClinicItemRequest(String catalogItemId, Integer gridX, Integer gridY, Integer rotation) {
        this.catalogItemId = catalogItemId;
        this.gridX = gridX;
        this.gridY = gridY;
        this.rotation = rotation != null ? rotation : 0;
    }

    public String getCatalogItemId() {
        return catalogItemId;
    }

    public void setCatalogItemId(String catalogItemId) {
        this.catalogItemId = catalogItemId;
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

    public Integer getRotation() {
        return rotation;
    }

    public void setRotation(Integer rotation) {
        this.rotation = rotation;
    }
}
