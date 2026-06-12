package com.medstudy.backend.modules.feed.repository;

import com.medstudy.backend.modules.feed.domain.FeedInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
/** Spring Data JPA repository for feed interaction entities. */
public interface FeedInteractionRepository extends JpaRepository<FeedInteraction, Long> {
}
