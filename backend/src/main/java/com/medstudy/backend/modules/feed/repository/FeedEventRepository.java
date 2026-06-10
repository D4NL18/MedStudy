package com.medstudy.backend.modules.feed.repository;

import com.medstudy.backend.modules.feed.domain.FeedEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedEventRepository extends JpaRepository<FeedEvent, Long> {
    Page<FeedEvent> findByUserIdInOrderByCreatedAtDesc(List<Long> friendUserIds, Pageable pageable);
}
