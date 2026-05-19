package com.medstudy.backend.modules.profile.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class Profile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true)
    private String handle;

    @Column(name = "nome_completo", nullable = false)
    private String nomeCompleto;

    @Column(name = "is_formado")
    private Boolean isFormado = false;

    @Column
    private Integer semestre;

    @Column(nullable = false)
    private String faculdade;

    @Column(name = "avatar_preset_id", nullable = false)
    private String avatarPresetId;

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getHandle() {
        return handle;
    }

    public void setHandle(String handle) {
        this.handle = handle;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public Integer getSemestre() {
        return semestre;
    }

    public void setSemestre(Integer semestre) {
        this.semestre = semestre;
    }

    public Boolean getIsFormado() {
        return isFormado;
    }

    public void setIsFormado(Boolean isFormado) {
        this.isFormado = isFormado;
    }

    public String getFaculdade() {
        return faculdade;
    }

    public void setFaculdade(String faculdade) {
        this.faculdade = faculdade;
    }

    public String getAvatarPresetId() {
        return avatarPresetId;
    }

    public void setAvatarPresetId(String avatarPresetId) {
        this.avatarPresetId = avatarPresetId;
    }
}
