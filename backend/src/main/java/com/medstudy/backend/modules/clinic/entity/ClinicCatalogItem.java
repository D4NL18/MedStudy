package com.medstudy.backend.modules.clinic.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * JPA Entity for clinic_items_catalog containing the 27 official clinic items (P-083).
 */
@Entity
@Table(name = "clinic_items_catalog")
public class ClinicCatalogItem {

    @Id
    @Column(name = "id", length = 50, nullable = false)
    private String id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "category", length = 50, nullable = false)
    private String category;

    @Column(name = "cost_xp", nullable = false)
    private int costXp;

    @Column(name = "min_expansion_level", nullable = false)
    private int minExpansionLevel = 1;

    @Column(name = "footprint_x", nullable = false)
    private int footprintX = 1;

    @Column(name = "footprint_y", nullable = false)
    private int footprintY = 1;

    @Column(name = "placement_type", length = 20, nullable = false)
    private String placementType = "FLOOR";

    @Column(name = "is_interactable", nullable = false)
    private boolean isInteractable = false;

    @Column(name = "sound_fx_url")
    private String soundFxUrl;

    @Column(name = "asset_svg_key", length = 100, nullable = false)
    private String assetSvgKey;

    @jakarta.persistence.Enumerated(jakarta.persistence.EnumType.STRING)
    @Column(name = "rarity", length = 20, nullable = false)
    private ItemRarity rarity = ItemRarity.COMMON;

    @Column(name = "is_lootbox_exclusive", nullable = false)
    private boolean isLootboxExclusive = false;

    public ClinicCatalogItem() {
    }

    public ClinicCatalogItem(
            String id,
            String name,
            String category,
            int costXp,
            int minExpansionLevel,
            int footprintX,
            int footprintY,
            boolean isInteractable,
            String soundFxUrl,
            String assetSvgKey
    ) {
        this(id, name, category, costXp, minExpansionLevel, footprintX, footprintY, "FLOOR", isInteractable, soundFxUrl, assetSvgKey);
    }

    public ClinicCatalogItem(
            String id,
            String name,
            String category,
            int costXp,
            int minExpansionLevel,
            int footprintX,
            int footprintY,
            String placementType,
            boolean isInteractable,
            String soundFxUrl,
            String assetSvgKey
    ) {
        this(id, name, category, costXp, minExpansionLevel, footprintX, footprintY, placementType, isInteractable, soundFxUrl, assetSvgKey, ItemRarity.COMMON, false);
    }

    public ClinicCatalogItem(
            String id,
            String name,
            String category,
            int costXp,
            int minExpansionLevel,
            int footprintX,
            int footprintY,
            String placementType,
            boolean isInteractable,
            String soundFxUrl,
            String assetSvgKey,
            ItemRarity rarity,
            boolean isLootboxExclusive
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.costXp = costXp;
        this.minExpansionLevel = minExpansionLevel;
        this.footprintX = footprintX;
        this.footprintY = footprintY;
        this.placementType = placementType != null ? placementType : "FLOOR";
        this.isInteractable = isInteractable;
        this.soundFxUrl = soundFxUrl;
        this.assetSvgKey = assetSvgKey;
        this.rarity = rarity != null ? rarity : ItemRarity.COMMON;
        this.isLootboxExclusive = isLootboxExclusive;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getCostXp() {
        return costXp;
    }

    public void setCostXp(int costXp) {
        this.costXp = costXp;
    }

    public int getMinExpansionLevel() {
        return minExpansionLevel;
    }

    public void setMinExpansionLevel(int minExpansionLevel) {
        this.minExpansionLevel = minExpansionLevel;
    }

    public int getFootprintX() {
        return footprintX;
    }

    public void setFootprintX(int footprintX) {
        this.footprintX = footprintX;
    }

    public int getFootprintY() {
        return footprintY;
    }

    public void setFootprintY(int footprintY) {
        this.footprintY = footprintY;
    }

    public String getPlacementType() {
        return placementType;
    }

    public void setPlacementType(String placementType) {
        this.placementType = placementType;
    }

    @JsonProperty("interactable")
    public boolean isInteractable() {
        return isInteractable;
    }

    @JsonProperty("isInteractable")
    public boolean getIsInteractable() {
        return isInteractable;
    }

    public void setInteractable(boolean interactable) {
        isInteractable = interactable;
    }

    public String getSoundFxUrl() {
        return soundFxUrl;
    }

    public void setSoundFxUrl(String soundFxUrl) {
        this.soundFxUrl = soundFxUrl;
    }

    public String getAssetSvgKey() {
        return assetSvgKey;
    }

    public void setAssetSvgKey(String assetSvgKey) {
        this.assetSvgKey = assetSvgKey;
    }

    public ItemRarity getRarity() {
        return rarity;
    }

    public void setRarity(ItemRarity rarity) {
        this.rarity = rarity != null ? rarity : ItemRarity.COMMON;
    }

    @JsonProperty("isLootboxExclusive")
    public boolean isLootboxExclusive() {
        return isLootboxExclusive;
    }

    public void setLootboxExclusive(boolean lootboxExclusive) {
        this.isLootboxExclusive = lootboxExclusive;
    }
}
