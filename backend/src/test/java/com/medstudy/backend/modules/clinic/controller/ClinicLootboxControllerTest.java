package com.medstudy.backend.modules.clinic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtAuthenticationFilter;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.clinic.dto.LootboxOpenResponseDto;
import com.medstudy.backend.modules.clinic.dto.LootboxProbabilitiesDto;
import com.medstudy.backend.modules.clinic.dto.LootboxTierResponseDto;
import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;
import com.medstudy.backend.modules.clinic.entity.ItemRarity;
import com.medstudy.backend.modules.clinic.entity.LootboxTier;
import com.medstudy.backend.modules.clinic.service.ClinicLootboxService;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ClinicLootboxController.class)
class ClinicLootboxControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ClinicLootboxService clinicLootboxService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private com.medstudy.backend.core.config.RateLimitInterceptor rateLimitInterceptor;

    private User user;

    @BeforeEach
    void setUp() throws Exception {
        when(rateLimitInterceptor.preHandle(any(), any(), any())).thenReturn(true);
        doAnswer(invocation -> {
            jakarta.servlet.http.HttpServletRequest request = invocation.getArgument(0);
            jakarta.servlet.http.HttpServletResponse response = invocation.getArgument(1);
            jakarta.servlet.FilterChain filterChain = invocation.getArgument(2);
            filterChain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());

        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("estudante@medstudy.com");
        user.setRole("ROLE_USER");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(user);
        when(authentication.isAuthenticated()).thenReturn(true);

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/clinic/lootboxes should return 200 with 3 tiers in data envelope")
    void shouldReturnLootboxTiersWithDataEnvelope() throws Exception {
        List<LootboxTierResponseDto> mockTiers = List.of(
                new LootboxTierResponseDto(
                        "TIER_1_RESIDENT", "Caixa do Residente", "Desc 1", 500,
                        "#94A3B8", "lootbox_tier1_resident", "COMMON",
                        new LootboxProbabilitiesDto(60.0, 30.0, 9.0, 1.0)
                ),
                new LootboxTierResponseDto(
                        "TIER_2_SPECIALIST", "Caixa do Especialista", "Desc 2", 1500,
                        "#0284C7", "lootbox_tier2_specialist", "RARE",
                        new LootboxProbabilitiesDto(0.0, 65.0, 28.0, 7.0)
                ),
                new LootboxTierResponseDto(
                        "TIER_3_CHIEF_OF_STAFF", "Caixa do Chefe de Ala", "Desc 3", 4000,
                        "#F59E0B", "lootbox_tier3_chief", "EPIC",
                        new LootboxProbabilitiesDto(0.0, 0.0, 75.0, 25.0)
                )
        );

        when(clinicLootboxService.getAvailableTiers()).thenReturn(mockTiers);

        mockMvc.perform(get("/api/v1/clinic/lootboxes")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(3))
                .andExpect(jsonPath("$.data[0].tier").value("TIER_1_RESIDENT"))
                .andExpect(jsonPath("$.data[0].costXp").value(500))
                .andExpect(jsonPath("$.data[0].probabilities.common").value(60.0))
                .andExpect(jsonPath("$.data[1].tier").value("TIER_2_SPECIALIST"))
                .andExpect(jsonPath("$.data[2].tier").value("TIER_3_CHIEF_OF_STAFF"))
                .andExpect(jsonPath("$.meta.totalTiers").value(3));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/clinic/lootboxes/TIER_1_RESIDENT/open should return 200 with dropped item")
    void shouldOpenLootboxSuccessfully() throws Exception {
        ClinicCatalogItem dropped = new ClinicCatalogItem(
                "ped_maca_foguete_retro", "Maca Foguete Espacial Retrô", "pediatria",
                3400, 2, 2, 1, "FLOOR", true, null, "ped_maca_foguete_retro",
                ItemRarity.RARE, true
        );

        LootboxOpenResponseDto response = new LootboxOpenResponseDto(
                "TIER_1_RESIDENT", "Caixa do Residente", 500, dropped,
                false, 0, 1500L, 5000L, Instant.now()
        );

        when(clinicLootboxService.openLootbox(eq(user.getId()), eq(LootboxTier.TIER_1_RESIDENT)))
                .thenReturn(response);

        mockMvc.perform(post("/api/v1/clinic/lootboxes/TIER_1_RESIDENT/open")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tier").value("TIER_1_RESIDENT"))
                .andExpect(jsonPath("$.costXp").value(500))
                .andExpect(jsonPath("$.droppedItem.id").value("ped_maca_foguete_retro"))
                .andExpect(jsonPath("$.droppedItem.rarity").value("RARE"))
                .andExpect(jsonPath("$.isDuplicate").value(false))
                .andExpect(jsonPath("$.cashbackXpAwarded").value(0))
                .andExpect(jsonPath("$.currentXpAfter").value(1500));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/clinic/lootboxes/INVALID_TIER/open should return 400 Bad Request")
    void shouldReturn400WhenTierIsInvalid() throws Exception {
        mockMvc.perform(post("/api/v1/clinic/lootboxes/INVALID_TIER/open")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/clinic/lootboxes/TIER_1_RESIDENT/open should return 422 when XP is insufficient")
    void shouldReturn422WhenInsufficientXp() throws Exception {
        when(clinicLootboxService.openLootbox(eq(user.getId()), eq(LootboxTier.TIER_1_RESIDENT)))
                .thenThrow(new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Saldo de XP insuficiente para realizar esta operação."));

        mockMvc.perform(post("/api/v1/clinic/lootboxes/TIER_1_RESIDENT/open")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity());
    }
}
