package com.medstudy.backend.modules.friendship.controller;

import com.medstudy.backend.modules.friendship.dto.SocialProfileResponseDTO;
import com.medstudy.backend.modules.friendship.service.FriendshipService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller for managing friendships and social interactions.
 */
@RestController
@RequestMapping("/api/friendships")
@Tag(name = "Friendships", description = "Endpoints for managing friendships and user blocks")
public class FriendshipController {

    private final FriendshipService friendshipService;

    /**
     * Constructs a FriendshipController with the specified FriendshipService.
     *
     * @param friendshipService the friendship service
     */
    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    /**
     * Searches for user profiles based on a query string.
     *
     * @param query the search query
     * @return a list of matching social profiles
     */
    @Operation(summary = "Search profiles", description = "Searches for user profiles by name or handle")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Profiles retrieved successfully")
    })
    @GetMapping("/search")
    public List<SocialProfileResponseDTO> searchProfiles(@RequestParam String query) {
        return friendshipService.searchProfiles(query);
    }

    /**
     * Retrieves the list of friends for the currently authenticated user.
     *
     * @return a list of the user's friends
     */
    @Operation(summary = "Get friends", description = "Retrieves the list of friends for the current user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friends retrieved successfully")
    })
    @GetMapping
    public List<SocialProfileResponseDTO> getFriends() {
        return friendshipService.getFriends();
    }

    /**
     * Retrieves the list of pending friend requests for the currently authenticated user.
     *
     * @return a list of pending friend requests
     */
    @Operation(summary = "Get pending requests", description = "Retrieves the pending friend requests for the current user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pending requests retrieved successfully")
    })
    @GetMapping("/pending")
    public List<SocialProfileResponseDTO> getPendingRequests() {
        return friendshipService.getPendingRequests();
    }

    /**
     * Retrieves the list of users blocked by the currently authenticated user.
     *
     * @return a list of blocked users
     */
    @Operation(summary = "Get blocked users", description = "Retrieves the list of blocked users for the current user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Blocked users retrieved successfully")
    })
    @GetMapping("/blocked")
    public List<SocialProfileResponseDTO> getBlockedUsers() {
        return friendshipService.getBlockedUsers();
    }

    /**
     * Sends a friend request to the specified user.
     *
     * @param receiverId the UUID of the user receiving the friend request
     */
    @Operation(summary = "Send friend request", description = "Sends a friend request to another user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friend request sent successfully")
    })
    @PostMapping("/request/{receiverId}")
    public void sendFriendRequest(@PathVariable UUID receiverId) {
        friendshipService.sendFriendRequest(receiverId);
    }

    /**
     * Accepts a friend request from the specified user.
     *
     * @param requesterId the UUID of the user who sent the friend request
     */
    @Operation(summary = "Accept friend request", description = "Accepts a pending friend request from another user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friend request accepted successfully")
    })
    @PostMapping("/accept/{requesterId}")
    public void acceptFriendRequest(@PathVariable UUID requesterId) {
        friendshipService.acceptFriendRequest(requesterId);
    }

    /**
     * Declines a friend request from the specified user.
     *
     * @param requesterId the UUID of the user who sent the friend request
     */
    @Operation(summary = "Decline friend request", description = "Declines a pending friend request from another user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friend request declined successfully")
    })
    @PostMapping("/decline/{requesterId}")
    public void declineFriendRequest(@PathVariable UUID requesterId) {
        friendshipService.declineFriendRequest(requesterId);
    }

    /**
     * Removes a friend from the current user's friend list.
     *
     * @param friendId the UUID of the friend to remove
     */
    @Operation(summary = "Remove friend", description = "Removes an existing friend from the current user's friend list")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Friend removed successfully")
    })
    @DeleteMapping("/{friendId}")
    public void removeFriend(@PathVariable UUID friendId) {
        friendshipService.removeFriend(friendId);
    }

    /**
     * Blocks the specified user.
     *
     * @param targetUserId the UUID of the user to block
     */
    @Operation(summary = "Block user", description = "Blocks a user from interacting with the current user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User blocked successfully")
    })
    @PostMapping("/block/{targetUserId}")
    public void blockUser(@PathVariable UUID targetUserId) {
        friendshipService.blockUser(targetUserId);
    }

    /**
     * Unblocks the specified user.
     *
     * @param targetUserId the UUID of the user to unblock
     */
    @Operation(summary = "Unblock user", description = "Unblocks a previously blocked user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User unblocked successfully")
    })
    @PostMapping("/unblock/{targetUserId}")
    public void unblockUser(@PathVariable UUID targetUserId) {
        friendshipService.unblockUser(targetUserId);
    }
}
