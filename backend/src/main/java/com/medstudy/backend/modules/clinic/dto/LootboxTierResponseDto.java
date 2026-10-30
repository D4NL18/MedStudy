package com.medstudy.backend.modules.clinic.dto;

public class LootboxTierResponseDto {

    private String tier;
    private String name;
    private String description;
    private int costXp;
    private String badgeColor;
    private String assetSvgKey;
    private String minRarityGuaranteed;
    private LootboxProbabilitiesDto probabilities;

    public LootboxTierResponseDto() {
    }

    public LootboxTierResponseDto(
            String tier,
            String name,
            String description,
            int costXp,
            String badgeColor,
            String assetSvgKey,
            String minRarityGuaranteed,
            LootboxProbabilitiesDto probabilities
    ) {
        this.tier = tier;
        this.name = name;
        this.description = description;
        this.costXp = costXp;
        this.badgeColor = badgeColor;
        this.assetSvgKey = assetSvgKey;
        this.minRarityGuaranteed = minRarityGuaranteed;
        this.probabilities = probabilities;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCostXp() {
        return costXp;
    }

    public void setCostXp(int costXp) {
        this.costXp = costXp;
    }

    public String getBadgeColor() {
        return badgeColor;
    }

    public void setBadgeColor(String badgeColor) {
        this.badgeColor = badgeColor;
    }

    public String getAssetSvgKey() {
        return assetSvgKey;
    }

    public void setAssetSvgKey(String assetSvgKey) {
        this.assetSvgKey = assetSvgKey;
    }

    public String getMinRarityGuaranteed() {
        return minRarityGuaranteed;
    }

    public void setMinRarityGuaranteed(String minRarityGuaranteed) {
        this.minRarityGuaranteed = minRarityGuaranteed;
    }

    public LootboxProbabilitiesDto getProbabilities() {
        return probabilities;
    }

    public void setProbabilities(LootboxProbabilitiesDto probabilities) {
        this.probabilities = probabilities;
    }
}
