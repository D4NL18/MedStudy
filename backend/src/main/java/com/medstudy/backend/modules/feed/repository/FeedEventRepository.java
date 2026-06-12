package com.medstudy.backend.modules.feed.repository;

import com.medstudy.backend.modules.feed.domain.FeedEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for accessing and managing feed events.
 */
@Repository
public interface FeedEventRepository extends JpaRepository<FeedEvent, Long> {
    
    /**
     * Finds feed events for a given list of user IDs, ordered by creation time descending.
     *
     * @param friendUserIds a list of user IDs (e.g., friends' IDs) to fetch events for
     * @param pageable      pagination information
     * @return a paginated list of feed events
     */
    Page<FeedEvent> findByUserIdInOrderByCreatedAtDesc(List<Long> friendUserIds, Pageable pageable);
}
