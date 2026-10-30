package com.medstudy.backend.modules.clinic.dto;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Response payload for study XP reward calculation and account credit (P-080, P-081, P-086).
 */
public class StudyActionRewardResponse {

    private int xpGranted;
    private int baseXp;
    private double streakMultiplier;
    private int streakMultiplierPercent;
    private int currentStreakDays;
    private long lifetimeXp;
    private long currentXp;
    private String actionType;
    private String message;

    public StudyActionRewardResponse() {
    }

    public StudyActionRewardResponse(
            int xpGranted,
            int baseXp,
            double streakMultiplier,
            int streakMultiplierPercent,
            int currentStreakDays,
            long lifetimeXp,
            long currentXp,
            String actionType,
            String message
    ) {
        this.xpGranted = xpGranted;
        this.baseXp = baseXp;
        this.streakMultiplier = streakMultiplier;
        this.streakMultiplierPercent = streakMultiplierPercent;
        this.currentStreakDays = currentStreakDays;
        this.lifetimeXp = lifetimeXp;
        this.currentXp = currentXp;
        this.actionType = actionType;
        this.message = message;
    }

    public Map<String, Object> getData() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("xpGranted", xpGranted);
        data.put("baseXp", baseXp);
        data.put("streakMultiplier", streakMultiplier);
        data.put("streakMultiplierPercent", streakMultiplierPercent);
        data.put("currentStreakDays", currentStreakDays);
        data.put("lifetimeXp", lifetimeXp);
        data.put("currentXp", currentXp);
        data.put("actionType", actionType);
        data.put("message", message);
        return data;
    }

    public Map<String, Object> getMeta() {
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("timestamp", Instant.now().toString());
        return meta;
    }

    public int getXpGranted() {
        return xpGranted;
    }

    public void setXpGranted(int xpGranted) {
        this.xpGranted = xpGranted;
    }

    public int getBaseXp() {
        return baseXp;
    }

    public void setBaseXp(int baseXp) {
        this.baseXp = baseXp;
    }

    public double getStreakMultiplier() {
        return streakMultiplier;
    }

    public void setStreakMultiplier(double streakMultiplier) {
        this.streakMultiplier = streakMultiplier;
    }

    public int getStreakMultiplierPercent() {
        return streakMultiplierPercent;
    }

    public void setStreakMultiplierPercent(int streakMultiplierPercent) {
        this.streakMultiplierPercent = streakMultiplierPercent;
    }

    public int getCurrentStreakDays() {
        return currentStreakDays;
    }

    public void setCurrentStreakDays(int currentStreakDays) {
        this.currentStreakDays = currentStreakDays;
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

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
