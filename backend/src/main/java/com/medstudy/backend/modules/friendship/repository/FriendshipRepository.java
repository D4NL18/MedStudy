package com.medstudy.backend.modules.friendship.repository;

import com.medstudy.backend.modules.friendship.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing Friendship entities.
 */
@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

    /**
     * Finds a friendship between two users, regardless of who is the requester or receiver.
     *
     * @param user1 the UUID of the first user
     * @param user2 the UUID of the second user
     * @return an Optional containing the friendship if it exists, empty otherwise
     */
    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :user1 AND f.receiver.id = :user2) OR (f.requester.id = :user2 AND f.receiver.id = :user1)")
    Optional<Friendship> findFriendshipBetween(@Param("user1") UUID user1, @Param("user2") UUID user2);

    /**
     * Finds all accepted friendships for a specific user.
     *
     * @param userId the UUID of the user
     * @return a list of accepted friendships
     */
    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :userId OR f.receiver.id = :userId) AND f.status = 'ACCEPTED'")
    List<Friendship> findAllAcceptedFriendships(@Param("userId") UUID userId);

    /**
     * Finds all pending friendship requests received by a specific user.
     *
     * @param userId the UUID of the user
     * @return a list of pending friendship requests
     */
    @Query("SELECT f FROM Friendship f WHERE f.receiver.id = :userId AND f.status = 'PENDING'")
    List<Friendship> findAllPendingRequestsReceived(@Param("userId") UUID userId);

    /**
     * Finds all blocked relationships for a specific user.
     *
     * @param userId the UUID of the user
     * @return a list of blocked relationships
     */
    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :userId OR f.receiver.id = :userId) AND f.status = 'BLOCKED'")
    List<Friendship> findAllBlockedRelationships(@Param("userId") UUID userId);
}
