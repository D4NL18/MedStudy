package com.medstudy.backend.modules.subscription.domain;

/**
 * Status of a PIX payment transaction.
 */
public enum PixStatus {
    CREATED,
    PAID,
    EXPIRED,
    CANCELLED
}
