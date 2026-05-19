package com.medstudy.backend.modules.friendship.controller;

import com.medstudy.backend.modules.friendship.dto.SocialProfileResponseDTO;
import com.medstudy.backend.modules.friendship.service.FriendshipService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    private final FriendshipService friendshipService;

    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    @GetMapping("/search")
    public List<SocialProfileResponseDTO> searchProfiles(@RequestParam String query) {
        return friendshipService.searchProfiles(query);
    }

    @GetMapping
    public List<SocialProfileResponseDTO> getFriends() {
        return friendshipService.getFriends();
    }

    @GetMapping("/pending")
    public List<SocialProfileResponseDTO> getPendingRequests() {
        return friendshipService.getPendingRequests();
    }

    @GetMapping("/blocked")
    public List<SocialProfileResponseDTO> getBlockedUsers() {
        return friendshipService.getBlockedUsers();
    }

    @PostMapping("/request/{receiverId}")
    public void sendFriendRequest(@PathVariable UUID receiverId) {
        friendshipService.sendFriendRequest(receiverId);
    }

    @PostMapping("/accept/{requesterId}")
    public void acceptFriendRequest(@PathVariable UUID requesterId) {
        friendshipService.acceptFriendRequest(requesterId);
    }

    @PostMapping("/decline/{requesterId}")
    public void declineFriendRequest(@PathVariable UUID requesterId) {
        friendshipService.declineFriendRequest(requesterId);
    }

    @DeleteMapping("/{friendId}")
    public void removeFriend(@PathVariable UUID friendId) {
        friendshipService.removeFriend(friendId);
    }

    @PostMapping("/block/{targetUserId}")
    public void blockUser(@PathVariable UUID targetUserId) {
        friendshipService.blockUser(targetUserId);
    }

    @PostMapping("/unblock/{targetUserId}")
    public void unblockUser(@PathVariable UUID targetUserId) {
        friendshipService.unblockUser(targetUserId);
    }
}
