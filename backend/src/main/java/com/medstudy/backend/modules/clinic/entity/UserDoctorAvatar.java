package com.medstudy.backend.modules.clinic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity for user_doctor_avatar representing the resident virtual doctor character in the clinic (P-089 / US-07).
 */
@Entity
@Table(name = "user_doctor_avatar")
public class UserDoctorAvatar {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "gender", nullable = false, length = 10)
    private String gender = "FEMALE";

    @Column(name = "skin_coat", nullable = false, length = 50)
    private String skinCoat = "coat_intern_white";

    @Column(name = "skin_stethoscope", nullable = false, length = 50)
    private String skinStethoscope = "steth_classic_black";

    @Column(name = "skin_accessory", nullable = false, length = 50)
    private String skinAccessory = "acc_none";

    @Column(name = "avatar_x", nullable = false)
    private int avatarX = 1;

    @Column(name = "avatar_y", nullable = false)
    private int avatarY = 1;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserDoctorAvatar() {
    }

    public UserDoctorAvatar(UUID userId) {
        this.userId = userId;
        this.gender = "FEMALE";
        this.skinCoat = "coat_intern_white";
        this.skinStethoscope = "steth_classic_black";
        this.skinAccessory = "acc_none";
        this.avatarX = 1;
        this.avatarY = 1;
        this.updatedAt = LocalDateTime.now();
    }

    public UserDoctorAvatar(
            UUID userId,
            String gender,
            String skinCoat,
            String skinStethoscope,
            String skinAccessory,
            int avatarX,
            int avatarY
    ) {
        this.userId = userId;
        this.gender = gender != null ? gender : "FEMALE";
        this.skinCoat = skinCoat != null ? skinCoat : "coat_intern_white";
        this.skinStethoscope = skinStethoscope != null ? skinStethoscope : "steth_classic_black";
        this.skinAccessory = skinAccessory != null ? skinAccessory : "acc_none";
        this.avatarX = avatarX;
        this.avatarY = avatarY;
        this.updatedAt = LocalDateTime.now();
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
