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
 * JPA Entity for user_unlocked_skins representing owned wardrobe skins and surfaces (P-087, P-089 / US-06, US-07).
 */
@Entity
@Table(name = "user_unlocked_skins")
public class UserUnlockedSkin {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "skin_slot", nullable = false, length = 20)
    private String skinSlot; // 'coat', 'stethoscope', 'accessory', 'surface_wall', 'surface_floor'

    @Column(name = "skin_id", nullable = false, length = 50)
    private String skinId;

    @Column(name = "unlocked_at", nullable = false)
    private LocalDateTime unlockedAt = LocalDateTime.now();

    public UserUnlockedSkin() {
    }

    public UserUnlockedSkin(UUID userId, String skinSlot, String skinId) {
        this.userId = userId;
        this.skinSlot = skinSlot;
        this.skinId = skinId;
        this.unlockedAt = LocalDateTime.now();
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

    public String getSkinSlot() {
        return skinSlot;
    }

    public void setSkinSlot(String skinSlot) {
        this.skinSlot = skinSlot;
    }

    public String getSkinId() {
        return skinId;
    }

    public void setSkinId(String skinId) {
        this.skinId = skinId;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }

    public void setUnlockedAt(LocalDateTime unlockedAt) {
        this.unlockedAt = unlockedAt;
    }
}
