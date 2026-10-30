package com.medstudy.backend.modules.clinic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtAuthenticationFilter;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.clinic.dto.BuyClinicItemRequest;
import com.medstudy.backend.modules.clinic.dto.BuyClinicItemResponse;
import com.medstudy.backend.modules.clinic.dto.ClinicStateResponse;
import com.medstudy.backend.modules.clinic.dto.PlacedItemDto;
import com.medstudy.backend.modules.clinic.dto.StudyActionRewardRequest;
import com.medstudy.backend.modules.clinic.dto.StudyActionRewardResponse;
import com.medstudy.backend.modules.clinic.dto.UpdateClinicLayoutRequest;
import com.medstudy.backend.modules.clinic.entity.StudyActionType;
import com.medstudy.backend.modules.clinic.service.ClinicService;
import com.medstudy.backend.modules.clinic.service.StudyXpEngineService;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {ClinicController.class, StudyRewardController.class})
class ClinicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ClinicService clinicService;

    @MockitoBean
    private StudyXpEngineService studyXpEngineService;

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
        user.setEmail("residente@medstudy.com");
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
    @DisplayName("GET /api/v1/clinic should return 200 OK with data/meta envelope and direct properties")
    void getClinic_ShouldReturn200WithEnvelopeAndDirectFields() throws Exception {
        ClinicStateResponse state = new ClinicStateResponse();
        state.setClinicId(UUID.randomUUID());
        state.setClinicName("Minha Clínica");
        state.setExpansionLevel(1);
        state.setExpansionName("Box do Internato");
        state.setGridWidth(4);
        state.setGridHeight(4);
        state.setLifetimeXp(1500L);
        state.setCurrentXp(1200L);
        state.setCatalog(ClinicService.OFFICIAL_CATALOG_ITEMS);

        when(clinicService.getOrInitClinic(any(UUID.class))).thenReturn(state);

        mockMvc.perform(get("/api/v1/clinic").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expansionLevel").value(1))
                .andExpect(jsonPath("$.data.expansionLevel").value(1))
                .andExpect(jsonPath("$.data.expansionName").value("Box do Internato"))
                .andExpect(jsonPath("$.meta.catalogTotalItems").value(104));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/clinic/expand should return 200 OK with updated expansion level")
    void expandClinic_ShouldReturn200() throws Exception {
        ClinicStateResponse expanded = new ClinicStateResponse();
        expanded.setClinicId(UUID.randomUUID());
        expanded.setExpansionLevel(2);
        expanded.setExpansionName("Consultório Júnior");
        expanded.setGridWidth(6);
        expanded.setGridHeight(6);
        expanded.setLifetimeXp(1600L);
        expanded.setCurrentXp(400L);

        when(clinicService.expandClinic(any(UUID.class))).thenReturn(expanded);

        mockMvc.perform(post("/api/v1/clinic/expand").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expansionLevel").value(2))
                .andExpect(jsonPath("$.data.expansionLevel").value(2))
                .andExpect(jsonPath("$.data.gridWidth").value(6));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/clinic/items/buy should return 200 OK when buying catalog item")
    void buyItem_ShouldReturn200() throws Exception {
        PlacedItemDto placed = new PlacedItemDto(UUID.randomUUID(), "ped_maca_dino", 2, 2, 0, true);
        ClinicStateResponse state = new ClinicStateResponse();
        state.setExpansionLevel(2);
        state.setLifetimeXp(5000L);
        state.setCurrentXp(1500L);
        state.setPlacedItems(List.of(placed));

        BuyClinicItemResponse response = BuyClinicItemResponse.from(placed, state, "Item adquirido com sucesso!");
        when(clinicService.buyItem(any(UUID.class), any(BuyClinicItemRequest.class))).thenReturn(response);

        BuyClinicItemRequest request = new BuyClinicItemRequest("ped_maca_dino", 2, 2, 0);

        mockMvc.perform(post("/api/v1/clinic/items/buy")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentXp").value(1500))
                .andExpect(jsonPath("$.data.purchasedItem.catalogItemId").value("ped_maca_dino"));
    }

    @Test
    @WithMockUser
    @DisplayName("PUT /api/v1/clinic/layout should return 200 OK when saving valid layout")
    void updateLayout_ShouldReturn200() throws Exception {
        PlacedItemDto item = new PlacedItemDto(UUID.randomUUID(), "mesa_scandi", 0, 0, 1, true);
        ClinicStateResponse state = new ClinicStateResponse();
        state.setExpansionLevel(1);
        state.setPlacedItems(List.of(item));

        when(clinicService.updateLayout(any(UUID.class), any(UpdateClinicLayoutRequest.class))).thenReturn(state);

        UpdateClinicLayoutRequest request = new UpdateClinicLayoutRequest(List.of(item));

        mockMvc.perform(put("/api/v1/clinic/layout")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.placedItems[0].rotation").value(1))
                .andExpect(jsonPath("$.data.placedItems[0].rotation").value(1));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/study/action-reward should return 200 OK with XP reward toast message")
    void rewardStudyAction_ShouldReturn200() throws Exception {
        StudyActionRewardResponse rewardResponse = new StudyActionRewardResponse(
                48, 40, 0.20, 20, 7, 1548L, 348L, "QUESTION_CORRECT", "+48 XP (Salvo na Clínica)"
        );

        when(studyXpEngineService.rewardStudyAction(any(UUID.class), any(StudyActionRewardRequest.class)))
                .thenReturn(rewardResponse);

        StudyActionRewardRequest request = new StudyActionRewardRequest();
        request.setActionType(StudyActionType.QUESTION_CORRECT);
        request.setReferenceId("q-42");

        mockMvc.perform(post("/api/v1/study/action-reward")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.xpGranted").value(48))
                .andExpect(jsonPath("$.data.xpGranted").value(48))
                .andExpect(jsonPath("$.data.message").value("+48 XP (Salvo na Clínica)"));
    }

    @Test
    @WithMockUser
    @DisplayName("PUT /api/v1/clinic/surfaces should return 200 OK with updated themes")
    void updateSurfaces_ShouldReturn200() throws Exception {
        ClinicStateResponse state = new ClinicStateResponse();
        state.setWallTheme("ped_papel_safari");
        state.setFloorTheme("floor_porcelanato_cinza");

        when(clinicService.updateSurfaces(any(UUID.class), any())).thenReturn(state);

        com.medstudy.backend.modules.clinic.dto.ClinicSurfacesUpdateRequest req =
                new com.medstudy.backend.modules.clinic.dto.ClinicSurfacesUpdateRequest("ped_papel_safari", "floor_porcelanato_cinza");

        mockMvc.perform(put("/api/v1/clinic/surfaces")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.wallTheme").value("ped_papel_safari"))
                .andExpect(jsonPath("$.data.wallTheme").value("ped_papel_safari"));
    }

    @Test
    @WithMockUser
    @DisplayName("GET /api/v1/clinic/avatar should return 200 OK with doctor avatar state")
    void getDoctorAvatar_ShouldReturn200() throws Exception {
        com.medstudy.backend.modules.clinic.dto.DoctorAvatarResponseDto avatar =
                new com.medstudy.backend.modules.clinic.dto.DoctorAvatarResponseDto(
                        UUID.randomUUID(), "FEMALE", "coat_intern_white", "steth_classic_black", "acc_none", 1, 1,
                        List.of("coat_intern_white"), List.of()
                );

        when(clinicService.getDoctorAvatar(any(UUID.class))).thenReturn(avatar);

        mockMvc.perform(get("/api/v1/clinic/avatar").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gender").value("FEMALE"))
                .andExpect(jsonPath("$.data.gender").value("FEMALE"))
                .andExpect(jsonPath("$.data.skinCoat").value("coat_intern_white"));
    }

    @Test
    @WithMockUser
    @DisplayName("PUT /api/v1/clinic/avatar should return 200 OK when changing gender and skins")
    void updateDoctorAvatar_ShouldReturn200() throws Exception {
        com.medstudy.backend.modules.clinic.dto.DoctorAvatarResponseDto updated =
                new com.medstudy.backend.modules.clinic.dto.DoctorAvatarResponseDto(
                        UUID.randomUUID(), "MALE", "coat_scrubs_navy", "steth_classic_black", "acc_none", 1, 1,
                        List.of("coat_scrubs_navy"), List.of()
                );

        when(clinicService.updateDoctorAvatar(any(UUID.class), any())).thenReturn(updated);

        com.medstudy.backend.modules.clinic.dto.DoctorAvatarUpdateDto req =
                new com.medstudy.backend.modules.clinic.dto.DoctorAvatarUpdateDto("MALE", "coat_scrubs_navy", "steth_classic_black", "acc_none");

        mockMvc.perform(put("/api/v1/clinic/avatar")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gender").value("MALE"))
                .andExpect(jsonPath("$.data.gender").value("MALE"));
    }

    @Test
    @WithMockUser
    @DisplayName("POST /api/v1/clinic/avatar/skins/buy should return 200 OK when buying skin")
    void buySkin_ShouldReturn200() throws Exception {
        java.util.Map<String, Object> res = java.util.Map.of(
                "skinId", "coat_pediatric_dino",
                "slot", "COAT",
                "costXp", 1200,
                "remainingCurrentXp", 800
        );

        when(clinicService.buySkin(any(UUID.class), eq("coat_pediatric_dino"))).thenReturn(res);

        com.medstudy.backend.modules.clinic.dto.SkinBuyRequestDto req =
                new com.medstudy.backend.modules.clinic.dto.SkinBuyRequestDto("coat_pediatric_dino");

        mockMvc.perform(post("/api/v1/clinic/avatar/skins/buy")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skinId").value("coat_pediatric_dino"))
                .andExpect(jsonPath("$.costXp").value(1200));
    }
}
