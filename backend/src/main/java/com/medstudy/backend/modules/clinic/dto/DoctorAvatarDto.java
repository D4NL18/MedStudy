package com.medstudy.backend.modules.clinic.dto;

import java.util.UUID;

public class DoctorAvatarDto {

    private UUID id;
    private String gender;
    private String skinCoat;
    private String skinStethoscope;
    private String skinAccessory;
    private int avatarX;
    private int avatarY;

    public DoctorAvatarDto() {
    }

    public DoctorAvatarDto(UUID id, String gender, String skinCoat, String skinStethoscope, String skinAccessory, int avatarX, int avatarY) {
        this.id = id;
        this.gender = gender;
        this.skinCoat = skinCoat;
        this.skinStethoscope = skinStethoscope;
        this.skinAccessory = skinAccessory;
        this.avatarX = avatarX;
        this.avatarY = avatarY;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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
}
