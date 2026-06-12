package com.medstudy.backend.modules.profile.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
/** Entity representing extended profile information for a user. */
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

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = true;

    @Column(name = "share_streak", nullable = false)
    private Boolean shareStreak = true;

    @Column(name = "share_faculdade", nullable = false)
    private Boolean shareFaculdade = true;

    @Column(name = "share_total_questions", nullable = false)
    private Boolean shareTotalQuestions = true;

    @Column(name = "share_badges", nullable = false)
    private Boolean shareBadges = true;
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

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Boolean getShareStreak() {
        return shareStreak;
    }

    public void setShareStreak(Boolean shareStreak) {
        this.shareStreak = shareStreak;
    }

    public Boolean getShareFaculdade() {
        return shareFaculdade;
    }

    public void setShareFaculdade(Boolean shareFaculdade) {
        this.shareFaculdade = shareFaculdade;
    }

    public Boolean getShareTotalQuestions() {
        return shareTotalQuestions;
    }

    public void setShareTotalQuestions(Boolean shareTotalQuestions) {
        this.shareTotalQuestions = shareTotalQuestions;
    }

    public Boolean getShareBadges() {
        return shareBadges;
    }

    public void setShareBadges(Boolean shareBadges) {
        this.shareBadges = shareBadges;
    }
}
