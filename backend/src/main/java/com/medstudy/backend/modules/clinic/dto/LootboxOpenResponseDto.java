package com.medstudy.backend.modules.clinic.dto;

import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * DTO for the result of opening a clinic lootbox (P-094, P-095).
 * Supports both direct field access and data/meta envelope.
 */
public class LootboxOpenResponseDto {

    private String tier;
    private String tierName;
    private int costXp;
    private ClinicCatalogItem droppedItem;
    private boolean isDuplicate;
    private int cashbackXpAwarded;
    private long currentXpAfter;
    private long lifetimeXp;
    private boolean isDailyFree = false;
    private Instant openedAt;

    public LootboxOpenResponseDto() {
        this.openedAt = Instant.now();
    }

    public LootboxOpenResponseDto(
            String tier,
            String tierName,
            int costXp,
            ClinicCatalogItem droppedItem,
            boolean isDuplicate,
            int cashbackXpAwarded,
            long currentXpAfter,
            long lifetimeXp,
            Instant openedAt
    ) {
        this(tier, tierName, costXp, droppedItem, isDuplicate, cashbackXpAwarded, currentXpAfter, lifetimeXp, false, openedAt);
    }

    public LootboxOpenResponseDto(
            String tier,
            String tierName,
            int costXp,
            ClinicCatalogItem droppedItem,
            boolean isDuplicate,
            int cashbackXpAwarded,
            long currentXpAfter,
            long lifetimeXp,
            boolean isDailyFree,
            Instant openedAt
    ) {
        this.tier = tier;
        this.tierName = tierName;
        this.costXp = costXp;
        this.droppedItem = droppedItem;
        this.isDuplicate = isDuplicate;
        this.cashbackXpAwarded = cashbackXpAwarded;
        this.currentXpAfter = currentXpAfter;
        this.lifetimeXp = lifetimeXp;
        this.isDailyFree = isDailyFree;
        this.openedAt = openedAt != null ? openedAt : Instant.now();
    }

    public Map<String, Object> getData() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("tier", tier);
        data.put("tierName", tierName);
        data.put("tierDisplayName", tierName);
        data.put("costXp", costXp);
        data.put("droppedItem", droppedItem);
        data.put("isDuplicate", isDuplicate);
        data.put("cashbackXpAwarded", cashbackXpAwarded);
        data.put("currentXp", currentXpAfter);
        data.put("currentXpAfter", currentXpAfter);
        data.put("lifetimeXp", lifetimeXp);
        data.put("isDailyFree", isDailyFree);
        data.put("openedAt", openedAt);
        return data;
    }

    public Map<String, Object> getMeta() {
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("timestamp", openedAt != null ? openedAt : Instant.now());
        return meta;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public String getTierName() {
        return tierName;
    }

    public void setTierName(String tierName) {
        this.tierName = tierName;
    }

    public int getCostXp() {
        return costXp;
    }

    public void setCostXp(int costXp) {
        this.costXp = costXp;
    }

    public ClinicCatalogItem getDroppedItem() {
        return droppedItem;
    }

    public void setDroppedItem(ClinicCatalogItem droppedItem) {
        this.droppedItem = droppedItem;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("isDuplicate")
    public boolean isDuplicate() {
        return isDuplicate;
    }

    public void setDuplicate(boolean duplicate) {
        isDuplicate = duplicate;
    }

    public int getCashbackXpAwarded() {
        return cashbackXpAwarded;
    }

    public void setCashbackXpAwarded(int cashbackXpAwarded) {
        this.cashbackXpAwarded = cashbackXpAwarded;
    }

    public long getCurrentXpAfter() {
        return currentXpAfter;
    }

    public long getCurrentXp() {
        return currentXpAfter;
    }

    public void setCurrentXpAfter(long currentXpAfter) {
        this.currentXpAfter = currentXpAfter;
    }

    public boolean isDailyFree() {
        return isDailyFree;
    }

    public void setDailyFree(boolean dailyFree) {
        isDailyFree = dailyFree;
    }

    public long getLifetimeXp() {
        return lifetimeXp;
    }

    public void setLifetimeXp(long lifetimeXp) {
        this.lifetimeXp = lifetimeXp;
    }

    public Instant getOpenedAt() {
        return openedAt;
    }

    public void setOpenedAt(Instant openedAt) {
        this.openedAt = openedAt;
    }
}
