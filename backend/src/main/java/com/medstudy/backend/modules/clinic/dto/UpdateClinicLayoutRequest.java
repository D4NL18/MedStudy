package com.medstudy.backend.modules.clinic.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

/**
 * Request payload for batch saving the spatial layout of owned items on the isometric grid (P-084).
 */
public class UpdateClinicLayoutRequest {

    @NotNull(message = "A lista de itens do layout não pode ser nula.")
    @Valid
    private List<PlacedItemDto> items = new ArrayList<>();

    public UpdateClinicLayoutRequest() {
    }

    public UpdateClinicLayoutRequest(List<PlacedItemDto> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public List<PlacedItemDto> getItems() {
        return items;
    }

    public void setItems(List<PlacedItemDto> items) {
        this.items = items;
    }
}
