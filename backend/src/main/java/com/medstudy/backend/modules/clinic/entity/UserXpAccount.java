package com.medstudy.backend.modules.clinic.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * JPA Entity for user_xp_accounts enforcing dual XP balances (P-080) and daily streak (P-081).
 */
@Entity
@Table(name = "user_xp_accounts")
public class UserXpAccount {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "lifetime_xp", nullable = false)
    private long lifetimeXp = 0L;

    @Column(name = "current_xp", nullable = false)
    private long currentXp = 0L;

    @Column(name = "current_streak_days", nullable = false)
    private int currentStreakDays = 0;

    @Column(name = "last_study_date")
    private LocalDate lastStudyDate;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserXpAccount() {
    }

    public UserXpAccount(UUID userId, long lifetimeXp, long currentXp, int currentStreakDays, LocalDate lastStudyDate) {
        this.userId = userId;
        this.lifetimeXp = lifetimeXp;
        this.currentXp = currentXp;
        this.currentStreakDays = currentStreakDays;
        this.lastStudyDate = lastStudyDate;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * P-080: Credits XP simultaneously to monotonic lifetimeXp and investable currentXp.
     */
    public void creditXp(long amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("O montante de crédito de XP não pode ser negativo.");
        }
        this.lifetimeXp += amount;
        this.currentXp += amount;
        this.updatedAt = LocalDateTime.now();
    }

    public void creditXp(int amount) {
        creditXp((long) amount);
    }

    /**
     * P-080: Debits XP strictly from currentXp while keeping lifetimeXp intact.
     */
    public void debitCurrentXp(long cost) {
        if (cost < 0) {
            throw new IllegalArgumentException("O custo de débito de XP não pode ser negativo.");
        }
        if (this.currentXp < cost) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Saldo de XP insuficiente para realizar esta operação."
            );
        }
        this.currentXp -= cost;
        this.updatedAt = LocalDateTime.now();
    }

    public void debitCurrentXp(int cost) {
        debitCurrentXp((long) cost);
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public long getLifetimeXp() {
        return lifetimeXp;
    }

    public void setLifetimeXp(long lifetimeXp) {
        this.lifetimeXp = lifetimeXp;
    }

    public long getCurrentXp() {
        return currentXp;
    }

    public void setCurrentXp(long currentXp) {
        this.currentXp = currentXp;
    }

    public int getCurrentStreakDays() {
        return currentStreakDays;
    }

    public void setCurrentStreakDays(int currentStreakDays) {
        this.currentStreakDays = currentStreakDays;
    }

    public LocalDate getLastStudyDate() {
        return lastStudyDate;
    }

    public void setLastStudyDate(LocalDate lastStudyDate) {
        this.lastStudyDate = lastStudyDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
