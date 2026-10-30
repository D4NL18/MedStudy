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
 * Immutable audit log entity for clinic lootbox openings (P-094, P-095).
 */
@Entity
@Table(name = "lootbox_opening_logs")
public class LootboxOpeningLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "box_tier", length = 30, nullable = false)
    private String boxTier;

    @Column(name = "cost_xp", nullable = false)
    private int costXp;

    @Column(name = "item_id_dropped", length = 50, nullable = false)
    private String itemIdDropped;

    @Column(name = "item_rarity", length = 20, nullable = false)
    private String itemRarity;

    @Column(name = "is_duplicate", nullable = false)
    private boolean isDuplicate = false;

    @Column(name = "cashback_xp_awarded", nullable = false)
    private int cashbackXpAwarded = 0;

    @Column(name = "opened_at", nullable = false)
    private LocalDateTime openedAt = LocalDateTime.now();

    public LootboxOpeningLog() {
    }

    public LootboxOpeningLog(
            UUID userId,
            String boxTier,
            int costXp,
            String itemIdDropped,
            String itemRarity,
            boolean isDuplicate,
            int cashbackXpAwarded,
            LocalDateTime openedAt
    ) {
        this.userId = userId;
        this.boxTier = boxTier;
        this.costXp = costXp;
        this.itemIdDropped = itemIdDropped;
        this.itemRarity = itemRarity;
        this.isDuplicate = isDuplicate;
        this.cashbackXpAwarded = cashbackXpAwarded;
        this.openedAt = openedAt != null ? openedAt : LocalDateTime.now();
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

    public String getBoxTier() {
        return boxTier;
    }

    public void setBoxTier(String boxTier) {
        this.boxTier = boxTier;
    }

    public int getCostXp() {
        return costXp;
    }

    public void setCostXp(int costXp) {
        this.costXp = costXp;
    }

    public String getItemIdDropped() {
        return itemIdDropped;
    }

    public void setItemIdDropped(String itemIdDropped) {
        this.itemIdDropped = itemIdDropped;
    }

    public String getItemRarity() {
        return itemRarity;
    }

    public void setItemRarity(String itemRarity) {
        this.itemRarity = itemRarity;
    }

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

    public LocalDateTime getOpenedAt() {
        return openedAt;
    }

    public void setOpenedAt(LocalDateTime openedAt) {
        this.openedAt = openedAt;
    }
}
