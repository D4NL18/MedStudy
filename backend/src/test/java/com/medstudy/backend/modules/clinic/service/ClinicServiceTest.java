package com.medstudy.backend.modules.clinic.service;

import com.medstudy.backend.modules.clinic.dto.BuyClinicItemRequest;
import com.medstudy.backend.modules.clinic.dto.BuyClinicItemResponse;
import com.medstudy.backend.modules.clinic.dto.ClinicStateResponse;
import com.medstudy.backend.modules.clinic.dto.ClinicSurfacesUpdateRequest;
import com.medstudy.backend.modules.clinic.dto.DoctorAvatarResponseDto;
import com.medstudy.backend.modules.clinic.dto.DoctorAvatarUpdateDto;
import com.medstudy.backend.modules.clinic.dto.PlacedItemDto;
import com.medstudy.backend.modules.clinic.dto.UpdateClinicLayoutRequest;
import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;
import com.medstudy.backend.modules.clinic.entity.ClinicPlacedItem;
import com.medstudy.backend.modules.clinic.entity.UserClinic;
import com.medstudy.backend.modules.clinic.entity.UserDoctorAvatar;
import com.medstudy.backend.modules.clinic.entity.UserUnlockedSkin;
import com.medstudy.backend.modules.clinic.entity.UserXpAccount;
import com.medstudy.backend.modules.clinic.entity.UserXpTransaction;
import com.medstudy.backend.modules.clinic.repository.ClinicCatalogItemRepository;
import com.medstudy.backend.modules.clinic.repository.ClinicPlacedItemRepository;
import com.medstudy.backend.modules.clinic.repository.UserClinicRepository;
import com.medstudy.backend.modules.clinic.repository.UserDoctorAvatarRepository;
import com.medstudy.backend.modules.clinic.repository.UserUnlockedSkinRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpAccountRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClinicServiceTest {

    @Mock
    private UserClinicRepository userClinicRepository;

    @Mock
    private UserXpAccountRepository userXpAccountRepository;

    @Mock
    private ClinicCatalogItemRepository clinicCatalogItemRepository;

    @Mock
    private ClinicPlacedItemRepository clinicPlacedItemRepository;

    @Mock
    private UserXpTransactionRepository userXpTransactionRepository;

    @Mock
    private UserDoctorAvatarRepository userDoctorAvatarRepository;

    @Mock
    private UserUnlockedSkinRepository userUnlockedSkinRepository;

    private ClinicLayoutValidator layoutValidator;
    private ClinicService clinicService;
    private UUID userId;

    @BeforeEach
    void setUp() {
        layoutValidator = new ClinicLayoutValidator();
        clinicService = new ClinicService(
                userClinicRepository,
                userXpAccountRepository,
                clinicCatalogItemRepository,
                clinicPlacedItemRepository,
                userXpTransactionRepository,
                layoutValidator,
                userDoctorAvatarRepository,
                userUnlockedSkinRepository
        );
        userId = UUID.randomUUID();
    }

    @Test
    @DisplayName("P-082, P-083 & P-084: First access should provision Level 1 Box do Internato (4x4) with 3 starter items and 27 catalog items")
    void shouldProvisionLevel1ClinicWithStarterItemsOnFirstAccess() {
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.empty());
        when(userXpAccountRepository.save(any(UserXpAccount.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(userClinicRepository.save(any(UserClinic.class))).thenAnswer(inv -> {
            UserClinic c = inv.getArgument(0);
            if (c.getId() == null) {
                c.setId(UUID.randomUUID());
            }
            return c;
        });

        List<ClinicPlacedItem> savedItems = new ArrayList<>();
        when(clinicPlacedItemRepository.saveAll(anyList())).thenAnswer(inv -> {
            List<ClinicPlacedItem> list = inv.getArgument(0);
            list.forEach(item -> {
                if (item.getId() == null) {
                    item.setId(UUID.randomUUID());
                }
            });
            savedItems.addAll(list);
            return list;
        });
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(any())).thenAnswer(inv -> savedItems);

        ClinicStateResponse state = clinicService.getOrInitClinic(userId);

        assertEquals(1, state.getExpansionLevel());
        assertEquals("Box do Internato", state.getExpansionName());
        assertEquals(4, state.getGridWidth());
        assertEquals(4, state.getGridHeight());
        assertEquals(3, state.getPlacedItems().size());
        assertTrue(state.getOwnedItemIds().containsAll(List.of("mesa_scandi", "cadeira_ergonomica", "ped_maca_baleia")));
        assertEquals(ClinicService.OFFICIAL_CATALOG_ITEMS.size(), state.getCatalog().size());
        assertNotNull(state.getData());
        assertNotNull(state.getMeta());
    }

    @Test
    @DisplayName("P-080 & P-082: Should expand clinic sequentially from Level 1 to Level 6, validating lifetime_xp and debiting only current_xp")
    void shouldExpandClinicFromLevel1ToLevel6DebitingOnlyCurrentXp() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setExpansionLevel(1);
        clinic.setGridWidth(4);
        clinic.setGridHeight(4);

        // Give user 50,000 lifetime XP and 70,000 current XP (total cost 1->6 is 1200+3800+8500+16000+32000 = 61,500 XP)
        UserXpAccount account = new UserXpAccount(userId, 50000L, 70000L, 10, LocalDate.now());

        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(userClinicRepository.save(any(UserClinic.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userXpAccountRepository.save(any(UserXpAccount.class))).thenAnswer(inv -> inv.getArgument(0));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(List.of());

        // Level 1 -> 2 (Cost 1200, Req 1500, 6x6)
        ClinicStateResponse s2 = clinicService.expandClinic(userId);
        assertEquals(2, s2.getExpansionLevel());
        assertEquals(6, s2.getGridWidth());
        assertEquals(6, s2.getGridHeight());
        assertEquals(50000L, s2.getLifetimeXp());
        assertEquals(68800L, s2.getCurrentXp());

        // Level 2 -> 3 (Cost 3800, Req 4500, 8x8)
        ClinicStateResponse s3 = clinicService.expandClinic(userId);
        assertEquals(3, s3.getExpansionLevel());
        assertEquals(8, s3.getGridWidth());
        assertEquals(8, s3.getGridHeight());
        assertEquals(50000L, s3.getLifetimeXp());
        assertEquals(65000L, s3.getCurrentXp());

        // Level 3 -> 4 (Cost 8500, Req 10000, 12x6)
        ClinicStateResponse s4 = clinicService.expandClinic(userId);
        assertEquals(4, s4.getExpansionLevel());
        assertEquals(12, s4.getGridWidth());
        assertEquals(6, s4.getGridHeight());
        assertEquals(56500L, s4.getCurrentXp());

        // Level 4 -> 5 (Cost 16000, Req 20000, 12x12)
        ClinicStateResponse s5 = clinicService.expandClinic(userId);
        assertEquals(5, s5.getExpansionLevel());
        assertEquals(12, s5.getGridWidth());
        assertEquals(12, s5.getGridHeight());
        assertEquals(40500L, s5.getCurrentXp());

        // Level 5 -> 6 (Cost 32000, Req 40000, 16x12)
        ClinicStateResponse s6 = clinicService.expandClinic(userId);
        assertEquals(6, s6.getExpansionLevel());
        assertEquals("Instituto Médico Completo", s6.getExpansionName());
        assertEquals(16, s6.getGridWidth());
        assertEquals(12, s6.getGridHeight());
        assertEquals(50000L, s6.getLifetimeXp()); // Never decreased!
        assertEquals(8500L, s6.getCurrentXp());
        assertFalse(s6.isCanExpand());

        // Attempting to expand beyond Level 6 must fail with 422
        ResponseStatusException maxEx = assertThrows(ResponseStatusException.class, () -> clinicService.expandClinic(userId));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, maxEx.getStatusCode());
    }

    @Test
    @DisplayName("P-082: Should block expansion when lifetime_xp or current_xp is insufficient")
    void shouldBlockExpansionWhenXpInsufficient() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setExpansionLevel(1);
        clinic.setGridWidth(4);
        clinic.setGridHeight(4);

        // Case 1: Enough currentXp (1400 >= 1200), but lifetimeXp < 1500
        UserXpAccount lowLifetime = new UserXpAccount(userId, 1400L, 1400L, 1, LocalDate.now());
        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(lowLifetime));

        ResponseStatusException ex1 = assertThrows(ResponseStatusException.class, () -> clinicService.expandClinic(userId));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex1.getStatusCode());

        // Case 2: Enough lifetimeXp (2000 >= 1500), but currentXp < 1200
        UserXpAccount lowCurrent = new UserXpAccount(userId, 2000L, 900L, 1, LocalDate.now());
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(lowCurrent));

        ResponseStatusException ex2 = assertThrows(ResponseStatusException.class, () -> clinicService.expandClinic(userId));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex2.getStatusCode());
    }

    @Test
    @DisplayName("P-080, P-083 & P-084: Should buy item atomically, debit only current_xp, and enforce minExpansionLevel")
    void shouldBuyItemAndEnforceMinExpansionLevel() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setExpansionLevel(1);
        clinic.setGridWidth(4);
        clinic.setGridHeight(4);

        UserXpAccount account = new UserXpAccount(userId, 5000L, 5000L, 5, LocalDate.now());

        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(userXpAccountRepository.save(any(UserXpAccount.class))).thenAnswer(inv -> inv.getArgument(0));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(new ArrayList<>());
        when(clinicPlacedItemRepository.save(any(ClinicPlacedItem.class))).thenAnswer(inv -> {
            ClinicPlacedItem item = inv.getArgument(0);
            item.setId(UUID.randomUUID());
            return item;
        });

        // 1. Try buying ped_maca_dino (minExpansionLevel = 2) while clinic is at Level 1 -> 422
        BuyClinicItemRequest lockedReq = new BuyClinicItemRequest("ped_maca_dino", 0, 0, 0);
        ResponseStatusException levelEx = assertThrows(ResponseStatusException.class,
                () -> clinicService.buyItem(userId, lockedReq));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, levelEx.getStatusCode());

        // 2. Try buying non-existent item -> 404
        BuyClinicItemRequest notFoundReq = new BuyClinicItemRequest("item_inexistente", 0, 0, 0);
        ResponseStatusException nfEx = assertThrows(ResponseStatusException.class,
                () -> clinicService.buyItem(userId, notFoundReq));
        assertEquals(HttpStatus.NOT_FOUND, nfEx.getStatusCode());

        // 3. Buy ped_regua_girafa (minExpansionLevel = 1, cost = 900 XP) -> 200 OK
        BuyClinicItemRequest validReq = new BuyClinicItemRequest("ped_regua_girafa", 1, 1, 0);
        BuyClinicItemResponse buyRes = clinicService.buyItem(userId, validReq);

        assertEquals(5000L, buyRes.getLifetimeXp()); // Untouched!
        assertEquals(4100L, buyRes.getCurrentXp());  // 5000 - 900 = 4100
        assertNotNull(buyRes.getPurchasedItem());
        assertEquals("ped_regua_girafa", buyRes.getPurchasedItem().getCatalogItemId());
        verify(userXpTransactionRepository).save(any(UserXpTransaction.class));
    }

    @Test
    @DisplayName("P-084: Should reject layout update if item belongs to another clinic (403 Forbidden)")
    void shouldRejectLayoutUpdateForForeignClinicItem() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setExpansionLevel(1);
        clinic.setGridWidth(4);
        clinic.setGridHeight(4);

        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(List.of());

        UUID foreignItemId = UUID.randomUUID();
        ClinicPlacedItem foreignEntity = new ClinicPlacedItem();
        foreignEntity.setId(foreignItemId);
        foreignEntity.setClinicId(UUID.randomUUID()); // Another user's clinic!
        foreignEntity.setCatalogItemId("mesa_scandi");

        when(clinicPlacedItemRepository.findById(foreignItemId)).thenReturn(Optional.of(foreignEntity));

        UpdateClinicLayoutRequest req = new UpdateClinicLayoutRequest(
                List.of(new PlacedItemDto(foreignItemId, "mesa_scandi", 0, 0, 0, true))
        );

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> clinicService.updateLayout(userId, req));
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
    }

    @Test
    @DisplayName("P-084 / Bugfix: Should unplace (set isPlaced=false) owned items that are omitted from updateLayout request")
    void shouldUnplaceOmittedItemsWhenUpdatingLayout() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setExpansionLevel(1);
        clinic.setGridWidth(4);
        clinic.setGridHeight(4);

        UUID item1Id = UUID.randomUUID();
        ClinicPlacedItem item1 = new ClinicPlacedItem();
        item1.setId(item1Id);
        item1.setClinicId(clinicId);
        item1.setCatalogItemId("mesa_scandi");
        item1.setGridX(0);
        item1.setGridY(0);
        item1.setPlaced(true);

        UUID item2Id = UUID.randomUUID();
        ClinicPlacedItem item2 = new ClinicPlacedItem();
        item2.setId(item2Id);
        item2.setClinicId(clinicId);
        item2.setCatalogItemId("cadeira_ergonomica");
        item2.setGridX(2);
        item2.setGridY(2);
        item2.setPlaced(true);

        UserXpAccount account = new UserXpAccount(userId, 5000L, 5000L, 2, LocalDate.now());

        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(List.of(item1, item2));

        // Request only keeps item1, omitting item2 (user unplaced item2 to stash in inventory)
        UpdateClinicLayoutRequest req = new UpdateClinicLayoutRequest(
                List.of(new PlacedItemDto(item1Id, "mesa_scandi", 0, 0, 0, true))
        );

        ClinicStateResponse response = clinicService.updateLayout(userId, req);

        assertNotNull(response);
        // item2 should have been marked as placed = false
        assertFalse(item2.isPlaced());
        verify(clinicPlacedItemRepository).saveAll(argThat(iterable -> {
            List<ClinicPlacedItem> saved = new ArrayList<>();
            iterable.forEach(saved::add);
            return saved.stream().anyMatch(i -> i.getId().equals(item2Id) && !i.isPlaced());
        }));
    }

    @Test
    @DisplayName("P-087 / C-05: Should allow updating unlocked surfaces and reject locked surfaces (403 Forbidden)")
    void shouldUpdateSurfacesWhenUnlockedAndRejectWhenLocked() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setWallTheme("wall_clean_white");
        clinic.setFloorTheme("floor_porcelanato_cinza");

        UserXpAccount account = new UserXpAccount(userId, 5000L, 5000L, 2, LocalDate.now());

        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(List.of());

        // 1. Trying to apply locked theme -> 403 Forbidden
        when(userUnlockedSkinRepository.findByUserId(userId)).thenReturn(List.of());
        ClinicSurfacesUpdateRequest lockedReq = new ClinicSurfacesUpdateRequest("ped_papel_safari", null);
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> clinicService.updateSurfaces(userId, lockedReq));
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());

        // 2. Applying unlocked theme -> 200 OK
        when(userUnlockedSkinRepository.findByUserId(userId)).thenReturn(List.of(
                new UserUnlockedSkin(userId, "surface_wall", "ped_papel_safari")
        ));
        ClinicStateResponse updated = clinicService.updateSurfaces(userId, lockedReq);
        assertEquals("ped_papel_safari", updated.getWallTheme());
    }

    @Test
    @DisplayName("P-089 / C-08: Alternating avatar gender between FEMALE and MALE should be 100% free")
    void shouldChangeAvatarGenderForFree() {
        UserDoctorAvatar avatar = new UserDoctorAvatar(userId);
        avatar.setGender("FEMALE");

        when(userDoctorAvatarRepository.findByUserId(userId)).thenReturn(Optional.of(avatar));
        when(userUnlockedSkinRepository.findByUserId(userId)).thenReturn(List.of());

        DoctorAvatarUpdateDto updateDto = new DoctorAvatarUpdateDto("MALE", null, null, null);
        DoctorAvatarResponseDto res = clinicService.updateDoctorAvatar(userId, updateDto);

        assertEquals("MALE", res.getGender());
        // Verify no XP transaction was saved
        verify(userXpTransactionRepository, never()).save(any(UserXpTransaction.class));
    }

    @Test
    @DisplayName("P-089 / C-09: Buying cosmetic skin should debit current_xp, preserve lifetime_xp, and reject if insufficient XP")
    void shouldBuyAvatarSkinAndDebitOnlyCurrentXp() {
        UserXpAccount account = new UserXpAccount(userId, 10000L, 1000L, 5, LocalDate.now());
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(userUnlockedSkinRepository.findByUserId(userId)).thenReturn(List.of());

        // 1. Try buying coat_pediatric_dino (cost: 1200 XP) with currentXp = 1000 -> 422
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> clinicService.buySkin(userId, "coat_pediatric_dino"));
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());

        // 2. Buy coat_scrubs_navy (cost: 500 XP) -> 200 OK
        java.util.Map<String, Object> buyRes = clinicService.buySkin(userId, "coat_scrubs_navy");
        assertEquals("coat_scrubs_navy", buyRes.get("skinId"));
        assertEquals(500L, buyRes.get("remainingCurrentXp")); // 1000 - 500 = 500
        assertEquals(10000L, account.getLifetimeXp()); // Lifetime untouched!

        verify(userUnlockedSkinRepository).save(any(UserUnlockedSkin.class));
        verify(userXpTransactionRepository).save(any(UserXpTransaction.class));
    }

    @Test
    @DisplayName("P-087: Purchasing ped_papel_safari should unlock skin, update wall_theme, and not occupy floor")
    void shouldApplyWallpaperToWallThemeAndNotOccupyFloor() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setExpansionLevel(1);
        clinic.setGridWidth(4);
        clinic.setGridHeight(4);

        UserXpAccount account = new UserXpAccount(userId, 2000L, 2000L, 1, LocalDate.now());

        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(new ArrayList<>());
        when(userUnlockedSkinRepository.findByUserId(userId)).thenReturn(List.of());

        BuyClinicItemRequest req = new BuyClinicItemRequest("ped_papel_safari", 0, 0, 0);
        BuyClinicItemResponse res = clinicService.buyItem(userId, req);

        assertEquals("ped_papel_safari", clinic.getWallTheme());
        assertFalse(res.getPurchasedItem().isPlaced());
        assertEquals(1150L, res.getCurrentXp()); // 2000 - 850 = 1150
        assertEquals(2000L, res.getLifetimeXp()); // Lifetime intact!
    }

    @Test
    @DisplayName("P-093: Direct purchase of lootbox exclusive item should throw 403 Forbidden")
    void shouldRejectDirectPurchaseOfLootboxExclusiveItem() {
        ClinicCatalogItem exclusiveItem = new ClinicCatalogItem(
                "ped_carrossel_musical_reino",
                "Carrossel Vitoriano Encantado com Música",
                "pediatria",
                16000,
                5,
                2,
                2,
                "FLOOR",
                true,
                "/assets/audio/clinic/music_box_waltz.mp3",
                "ped_carrossel_musical_reino",
                com.medstudy.backend.modules.clinic.entity.ItemRarity.LEGENDARY,
                true
        );

        when(clinicCatalogItemRepository.findById("ped_carrossel_musical_reino"))
                .thenReturn(Optional.of(exclusiveItem));

        BuyClinicItemRequest request = new BuyClinicItemRequest("ped_carrossel_musical_reino", 0, 0, 0);

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> clinicService.buyItem(userId, request)
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        assertTrue(ex.getReason().contains("relíquia exclusiva de Lootbox"));
        verify(userXpAccountRepository, never()).save(any());
    }

    @Test
    @DisplayName("P-096.1 & P-096.2: Should buy canonical wallpaper geometric teal, debit XP and apply wall theme")
    void shouldBuyCanonicalWallpaperGeometricTeal() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setExpansionLevel(1);
        clinic.setWallTheme("clean_white");

        UserXpAccount account = new UserXpAccount(userId, 3000L, 5000L, 0, null);

        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(userUnlockedSkinRepository.findByUserId(userId)).thenReturn(List.of());

        BuyClinicItemRequest request = new BuyClinicItemRequest("wallpaper_geometric_teal", 0, 0, 0);
        BuyClinicItemResponse res = clinicService.buyItem(userId, request);

        assertEquals("wallpaper_geometric_teal", clinic.getWallTheme());
        assertEquals(4050L, res.getCurrentXp()); // 5000 - 950 = 4050
        verify(userUnlockedSkinRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("P-096.1 & P-096.2: Should allow free default surfaces in updateSurfaces without prior purchase")
    void shouldAllowFreeSurfacesInUpdateSurfaces() {
        UUID clinicId = UUID.randomUUID();
        UserClinic clinic = new UserClinic();
        clinic.setId(clinicId);
        clinic.setUserId(userId);
        clinic.setExpansionLevel(1);
        clinic.setWallTheme("wallpaper_geometric_teal");
        clinic.setFloorTheme("wood_dark_herringbone");

        UserXpAccount account = new UserXpAccount(userId, 1000L, 1000L, 0, null);

        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(userUnlockedSkinRepository.findByUserId(userId)).thenReturn(List.of());

        ClinicSurfacesUpdateRequest request = new ClinicSurfacesUpdateRequest("clean_white", "wood_light");
        ClinicStateResponse res = clinicService.updateSurfaces(userId, request);

        assertEquals("clean_white", res.getWallTheme());
        assertEquals("wood_light", res.getFloorTheme());
    }
}
