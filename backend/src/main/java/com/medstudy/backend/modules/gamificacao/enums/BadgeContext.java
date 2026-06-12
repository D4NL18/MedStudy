package com.medstudy.backend.modules.gamificacao.enums;

/**
 * Enumeration representing the context in which a badge might be evaluated.
 */
public enum BadgeContext {
    /**
     * Context when evaluating badges related to question sessions.
     */
    QUESTION_SESSION,
    
    /**
     * Context when evaluating badges related to simulado sessions.
     */
    SIMULADO_SESSION,
    
    /**
     * General context for overall evaluations, such as scheduled jobs.
     */
    GENERAL
}
