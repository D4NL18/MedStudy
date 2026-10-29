package com.medstudy.backend.modules.clinic.dto;

public class DoctorSkinCatalogDto {

    private String id;
    private String slot; // 'COAT', 'STETHOSCOPE', 'ACCESSORY'
    private String name;
    private int costXp;
    private String assetSvgKey;
    private boolean owned;

    public DoctorSkinCatalogDto() {
    }

    public DoctorSkinCatalogDto(String id, String slot, String name, int costXp, String assetSvgKey, boolean owned) {
        this.id = id;
        this.slot = slot;
        this.name = name;
        this.costXp = costXp;
        this.assetSvgKey = assetSvgKey;
        this.owned = owned;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSlot() {
        return slot;
    }

    public void setSlot(String slot) {
        this.slot = slot;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCostXp() {
        return costXp;
    }

    public void setCostXp(int costXp) {
        this.costXp = costXp;
    }

    public String getAssetSvgKey() {
        return assetSvgKey;
    }

    public void setAssetSvgKey(String assetSvgKey) {
        this.assetSvgKey = assetSvgKey;
    }

    public boolean isOwned() {
        return owned;
    }

    public void setOwned(boolean owned) {
        this.owned = owned;
    }
}
