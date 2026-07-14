package com.medstudy.backend.modules.subscription.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.*;

import java.time.Instant;

/**
 * Entity representing a user Subscription in MedStudy.
 */
@Entity
@Table(name = "subscriptions", indexes = {
    @Index(name = "idx_subscriptions_user_id", columnList = "user_id"),
    @Index(name = "idx_subscriptions_status_end_dates", columnList = "status, trial_end_date, current_period_end")
})
public class Subscription extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Column(name = "trial_start_date", nullable = false)
    private Instant trialStartDate;

    @Column(name = "trial_end_date", nullable = false)
    private Instant trialEndDate;

    @Column(name = "current_period_start")
    private Instant currentPeriodStart;

    @Column(name = "current_period_end")
    private Instant currentPeriodEnd;

    @Column(name = "is_admin_override", nullable = false)
    private boolean isAdminOverride = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public void setStatus(SubscriptionStatus status) {
        this.status = status;
    }

    public Instant getTrialStartDate() {
        return trialStartDate;
    }

    public void setTrialStartDate(Instant trialStartDate) {
        this.trialStartDate = trialStartDate;
    }

    public Instant getTrialEndDate() {
        return trialEndDate;
    }

    public void setTrialEndDate(Instant trialEndDate) {
        this.trialEndDate = trialEndDate;
    }

    public Instant getCurrentPeriodStart() {
        return currentPeriodStart;
    }

    public void setCurrentPeriodStart(Instant currentPeriodStart) {
        this.currentPeriodStart = currentPeriodStart;
    }

    public Instant getCurrentPeriodEnd() {
        return currentPeriodEnd;
    }

    public void setCurrentPeriodEnd(Instant currentPeriodEnd) {
        this.currentPeriodEnd = currentPeriodEnd;
    }

    public boolean isAdminOverride() {
        return isAdminOverride;
    }

    public void setAdminOverride(boolean adminOverride) {
        isAdminOverride = adminOverride;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    /**
     * Checks if the subscription is currently active at the given timestamp.
     *
     * @param now the timestamp to test against
     * @return true if subscription is LIFETIME, or if status is TRIAL/ACTIVE and dates are valid
     */
    public boolean isCurrentlyActive(Instant now) {
        if (now == null) {
            now = Instant.now();
        }
        if (status == SubscriptionStatus.LIFETIME) {
            return true;
        }
        if (status == SubscriptionStatus.EXPIRED) {
            return false;
        }
        if (status == SubscriptionStatus.TRIAL) {
            return trialEndDate != null && trialEndDate.isAfter(now);
        }
        if (status == SubscriptionStatus.ACTIVE) {
            return currentPeriodEnd != null && currentPeriodEnd.isAfter(now);
        }
        return false;
    }
}
