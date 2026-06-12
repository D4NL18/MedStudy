package com.medstudy.backend.modules.notificacao.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.*;

/**
 * Entity representing a social notification for a user.
 */
@Entity
@Table(name = "social_notifications")
public class SocialNotification extends BaseEntity {

    /**
     * The user who receives the notification.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * The user who sent the notification.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    /**
     * The type of the notification.
     */
    @Column(nullable = false)
    private String type;

    /**
     * The message content of the notification.
     */
    @Column(nullable = false)
    private String message;

    /**
     * Indicates whether the notification has been read.
     */
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    /**
     * Gets the user who receives the notification.
     *
     * @return the user
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the user who receives the notification.
     *
     * @param user the user to set
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Gets the user who sent the notification.
     *
     * @return the sender
     */
    public User getSender() {
        return sender;
    }

    /**
     * Sets the user who sent the notification.
     *
     * @param sender the sender to set
     */
    public void setSender(User sender) {
        this.sender = sender;
    }

    /**
     * Gets the type of the notification.
     *
     * @return the notification type
     */
    public String getType() {
        return type;
    }

    /**
     * Sets the type of the notification.
     *
     * @param type the notification type to set
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * Gets the message content of the notification.
     *
     * @return the notification message
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the message content of the notification.
     *
     * @param message the notification message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Gets the read status of the notification.
     *
     * @return true if read, false otherwise
     */
    public Boolean getIsRead() {
        return isRead;
    }

    /**
     * Sets the read status of the notification.
     *
     * @param isRead the read status to set
     */
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
