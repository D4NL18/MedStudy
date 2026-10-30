package com.medstudy.backend.modules.clinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SkinBuyRequestDto {

    @NotBlank(message = "O identificador da skin cosmética é obrigatório.")
    @Size(max = 50, message = "O identificador da skin deve ter no máximo 50 caracteres.")
    private String skinId;

    public SkinBuyRequestDto() {
    }

    public SkinBuyRequestDto(String skinId) {
        this.skinId = skinId;
    }

    public String getSkinId() {
        return skinId;
    }

    public void setSkinId(String skinId) {
        this.skinId = skinId;
    }
}
