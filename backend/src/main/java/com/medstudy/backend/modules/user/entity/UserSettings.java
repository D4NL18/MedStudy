package com.medstudy.backend.modules.user.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import jakarta.persistence.*;

/**
 * Entity representing user-specific settings and preferences.
 */
@Entity
@Table(name = "user_settings")
public class UserSettings extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "max_reviews_per_day")
    private Integer maxReviewsPerDay;

    @Column(name = "theme_color")
    private String themeColor;

    /**
     * Gets the associated user.
     *
     * @return the user
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the associated user.
     *
     * @param user the user to set
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Gets the maximum number of reviews per day.
     *
     * @return the max reviews per day
     */
    public Integer getMaxReviewsPerDay() {
        return maxReviewsPerDay;
    }

    /**
     * Sets the maximum number of reviews per day.
     *
     * @param maxReviewsPerDay the max reviews per day to set
     */
    public void setMaxReviewsPerDay(Integer maxReviewsPerDay) {
        this.maxReviewsPerDay = maxReviewsPerDay;
    }

    /**
     * Gets the user's chosen UI theme color.
     *
     * @return the theme color
     */
    public String getThemeColor() {
        return themeColor;
    }

    /**
     * Sets the user's chosen UI theme color.
     *
     * @param themeColor the theme color to set
     */
    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }
}
