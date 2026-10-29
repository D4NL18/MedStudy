package com.medstudy.backend.modules.clinic.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class DoctorAvatarUpdateDto {

    @Pattern(regexp = "^(MALE|FEMALE)$", message = "Gênero inválido. Opções permitidas: MALE ou FEMALE.")
    private String gender;

    @Size(max = 50, message = "Identificador de jaleco/roupa deve ter no máximo 50 caracteres.")
    private String skinCoat;

    @Size(max = 50, message = "Identificador de estetoscópio deve ter no máximo 50 caracteres.")
    private String skinStethoscope;

    @Size(max = 50, message = "Identificador de acessório deve ter no máximo 50 caracteres.")
    private String skinAccessory;

    private Integer avatarX;
    private Integer avatarY;

    public DoctorAvatarUpdateDto() {
    }

    public DoctorAvatarUpdateDto(String gender, String skinCoat, String skinStethoscope, String skinAccessory) {
        this.gender = gender;
        this.skinCoat = skinCoat;
        this.skinStethoscope = skinStethoscope;
        this.skinAccessory = skinAccessory;
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

    public Integer getAvatarX() {
        return avatarX;
    }

    public void setAvatarX(Integer avatarX) {
        this.avatarX = avatarX;
    }

    public Integer getAvatarY() {
        return avatarY;
    }

    public void setAvatarY(Integer avatarY) {
        this.avatarY = avatarY;
    }
}
