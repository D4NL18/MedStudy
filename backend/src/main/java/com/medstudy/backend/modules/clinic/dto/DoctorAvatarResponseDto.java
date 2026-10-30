package com.medstudy.backend.modules.clinic.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Consolidated Doctor Avatar response supporting direct access and data/meta envelope (P-089 / US-07).
 */
public class DoctorAvatarResponseDto {

    private UUID avatarId;
    private String gender; // 'FEMALE' or 'MALE'
    private String skinCoat;
    private String skinStethoscope;
    private String skinAccessory;
    private int avatarX;
    private int avatarY;
    private List<String> unlockedSkins = new ArrayList<>();
    private List<DoctorSkinCatalogDto> catalogSkins = new ArrayList<>();

    public DoctorAvatarResponseDto() {
    }

    public DoctorAvatarResponseDto(
            UUID avatarId,
            String gender,
            String skinCoat,
            String skinStethoscope,
            String skinAccessory,
            int avatarX,
            int avatarY,
            List<String> unlockedSkins,
            List<DoctorSkinCatalogDto> catalogSkins
    ) {
        this.avatarId = avatarId;
        this.gender = gender;
        this.skinCoat = skinCoat;
        this.skinStethoscope = skinStethoscope;
        this.skinAccessory = skinAccessory;
        this.avatarX = avatarX;
        this.avatarY = avatarY;
        this.unlockedSkins = unlockedSkins != null ? unlockedSkins : new ArrayList<>();
        this.catalogSkins = catalogSkins != null ? catalogSkins : new ArrayList<>();
    }

    @JsonProperty("data")
    public Map<String, Object> getData() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("avatarId", avatarId);
        data.put("gender", gender);
        data.put("skinCoat", skinCoat);
        data.put("skinStethoscope", skinStethoscope);
        data.put("skinAccessory", skinAccessory);
        data.put("avatarX", avatarX);
        data.put("avatarY", avatarY);
        data.put("unlockedSkins", unlockedSkins);
        data.put("catalogSkins", catalogSkins);
        return data;
    }

    @JsonProperty("meta")
    public Map<String, Object> getMeta() {
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("timestamp", Instant.now().toString());
        meta.put("totalUnlocked", unlockedSkins != null ? unlockedSkins.size() : 0);
        return meta;
    }

    public UUID getAvatarId() {
        return avatarId;
    }

    public void setAvatarId(UUID avatarId) {
        this.avatarId = avatarId;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getSkinCoat() {
        return skinCoat;
    }

    public void setSkinCoat(String skinCoat) {
        this.skinCoat = skinCoat;
    }

    public String getSkinStethoscope() {
        return skinStethoscope;
    }

    public void setSkinStethoscope(String skinStethoscope) {
        this.skinStethoscope = skinStethoscope;
    }

    public String getSkinAccessory() {
        return skinAccessory;
    }

    public void setSkinAccessory(String skinAccessory) {
        this.skinAccessory = skinAccessory;
    }

    public int getAvatarX() {
        return avatarX;
    }

    public void setAvatarX(int avatarX) {
        this.avatarX = avatarX;
    }

    public int getAvatarY() {
        return avatarY;
    }

    public void setAvatarY(int avatarY) {
        this.avatarY = avatarY;
    }

    public List<String> getUnlockedSkins() {
        return unlockedSkins;
    }

    public void setUnlockedSkins(List<String> unlockedSkins) {
        this.unlockedSkins = unlockedSkins;
    }

    public List<DoctorSkinCatalogDto> getCatalogSkins() {
        return catalogSkins;
    }

    public void setCatalogSkins(List<DoctorSkinCatalogDto> catalogSkins) {
        this.catalogSkins = catalogSkins;
    }
}
