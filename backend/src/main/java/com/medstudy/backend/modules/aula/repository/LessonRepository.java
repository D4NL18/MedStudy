package com.medstudy.backend.modules.aula.repository;

import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing Lesson entities.
 */
@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID>, JpaSpecificationExecutor<Lesson> {
    
    /**
     * Finds lessons by user ID and containing a specific theme.
     *
     * @param userId the user ID
     * @param tema the theme
     * @return list of lessons
     */
    java.util.List<Lesson> findByUserIdAndTemaContainingIgnoreCase(UUID userId, String tema);
    
    /**
     * Finds a lesson by user and specific theme.
     *
     * @param user the user
     * @param tema the theme
     * @return an optional containing the lesson if found
     */
    Optional<Lesson> findByUserAndTema(User user, String tema);
    
    /**
     * Counts the number of lessons requiring reinforcement for a specific user.
     *
     * @param userId the user ID
     * @return the count of lessons
     */
    long countByUserIdAndReforcoTrue(UUID userId);
    
    /**
     * Counts the total number of lessons for a specific user.
     *
     * @param userId the user ID
     * @return the count of lessons
     */
    long countByUserId(UUID userId);
    
    /**
     * Counts the number of watched lessons for a specific user.
     *
     * @param userId the user ID
     * @return the count of watched lessons
     */
    long countByUserIdAndAulaAssistidaTrue(UUID userId);
    
    /**
     * Counts the number of pending (unwatched) lessons for a specific user.
     *
     * @param userId the user ID
     * @return the count of pending lessons
     */
    long countByUserIdAndAulaAssistidaFalse(UUID userId);
    
    /**
     * Counts the number of pending lessons with a specific priority for a user.
     *
     * @param userId the user ID
     * @param prioridade the priority level
     * @return the count of pending lessons matching the priority
     */
    long countByUserIdAndAulaAssistidaFalseAndPrioridade(UUID userId, com.medstudy.backend.modules.aula.entity.LessonPriority prioridade);
}
