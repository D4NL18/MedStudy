package com.medstudy.backend.modules.friendship.controller;

import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.friendship.dto.SocialProfileResponseDTO;
import com.medstudy.backend.modules.friendship.service.FriendshipService;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FriendshipController.class)
class FriendshipControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FriendshipService friendshipService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private com.medstudy.backend.core.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    private User user;
    private SocialProfileResponseDTO friendDTO;

    @BeforeEach
    void setUp() throws jakarta.servlet.ServletException, java.io.IOException {
        doAnswer(invocation -> {
            jakarta.servlet.http.HttpServletRequest request = invocation.getArgument(0);
            jakarta.servlet.http.HttpServletResponse response = invocation.getArgument(1);
            jakarta.servlet.FilterChain filterChain = invocation.getArgument(2);
            filterChain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());

        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("medico@medstudy.com");

        friendDTO = new SocialProfileResponseDTO(
                UUID.randomUUID(),
                "Amigo Teste",
                "amigoteste",
                "Faculdade Federal",
                4,
                "cardiology",
                false,
                "ACCEPTED",
                true,
                3
        );

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(user);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @WithMockUser
    void searchProfiles_ShouldReturnProfiles_WhenQueryIsValid() throws Exception {
        when(friendshipService.searchProfiles("Amigo")).thenReturn(List.of(friendDTO));

        mockMvc.perform(get("/api/friendships/search")
                .param("query", "Amigo")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Amigo Teste"))
                .andExpect(jsonPath("$[0].relationshipStatus").value("ACCEPTED"));
    }

    @Test
    @WithMockUser
    void getFriends_ShouldReturnFriendsList() throws Exception {
        when(friendshipService.getFriends()).thenReturn(List.of(friendDTO));

        mockMvc.perform(get("/api/friendships")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Amigo Teste"));
    }

    @Test
    @WithMockUser
    void sendFriendRequest_ShouldReturn200() throws Exception {
        UUID receiverId = UUID.randomUUID();
        doNothing().when(friendshipService).sendFriendRequest(receiverId);

        mockMvc.perform(post("/api/friendships/request/" + receiverId)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(friendshipService, times(1)).sendFriendRequest(receiverId);
    }

    @Test
    @WithMockUser
    void acceptFriendRequest_ShouldReturn200() throws Exception {
        UUID requesterId = UUID.randomUUID();
        doNothing().when(friendshipService).acceptFriendRequest(requesterId);

        mockMvc.perform(post("/api/friendships/accept/" + requesterId)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(friendshipService, times(1)).acceptFriendRequest(requesterId);
    }

    @Test
    @WithMockUser
    void declineFriendRequest_ShouldReturn200() throws Exception {
        UUID requesterId = UUID.randomUUID();
        doNothing().when(friendshipService).declineFriendRequest(requesterId);

        mockMvc.perform(post("/api/friendships/decline/" + requesterId)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(friendshipService, times(1)).declineFriendRequest(requesterId);
    }

    @Test
    @WithMockUser
    void removeFriend_ShouldReturn200() throws Exception {
        UUID friendId = UUID.randomUUID();
        doNothing().when(friendshipService).removeFriend(friendId);

        mockMvc.perform(delete("/api/friendships/" + friendId)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(friendshipService, times(1)).removeFriend(friendId);
    }

    @Test
    @WithMockUser
    void blockUser_ShouldReturn200() throws Exception {
        UUID targetUserId = UUID.randomUUID();
        doNothing().when(friendshipService).blockUser(targetUserId);

        mockMvc.perform(post("/api/friendships/block/" + targetUserId)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(friendshipService, times(1)).blockUser(targetUserId);
    }

    @Test
    @WithMockUser
    void unblockUser_ShouldReturn200() throws Exception {
        UUID targetUserId = UUID.randomUUID();
        doNothing().when(friendshipService).unblockUser(targetUserId);

        mockMvc.perform(post("/api/friendships/unblock/" + targetUserId)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(friendshipService, times(1)).unblockUser(targetUserId);
    }
}
