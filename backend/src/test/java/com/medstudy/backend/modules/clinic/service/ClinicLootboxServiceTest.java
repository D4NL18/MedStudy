package com.medstudy.backend.modules.clinic.service;

import com.medstudy.backend.modules.clinic.dto.LootboxOpenResponseDto;
import com.medstudy.backend.modules.clinic.dto.LootboxTierResponseDto;
import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;
import com.medstudy.backend.modules.clinic.entity.ClinicPlacedItem;
import com.medstudy.backend.modules.clinic.entity.ItemRarity;
import com.medstudy.backend.modules.clinic.entity.LootboxOpeningLog;
import com.medstudy.backend.modules.clinic.entity.LootboxTier;
import com.medstudy.backend.modules.clinic.entity.StudyActionType;
import com.medstudy.backend.modules.clinic.entity.UserClinic;
import com.medstudy.backend.modules.clinic.entity.UserXpAccount;
import com.medstudy.backend.modules.clinic.entity.UserXpTransaction;
import com.medstudy.backend.modules.clinic.repository.ClinicCatalogItemRepository;
import com.medstudy.backend.modules.clinic.repository.ClinicPlacedItemRepository;
import com.medstudy.backend.modules.clinic.repository.LootboxOpeningLogRepository;
import com.medstudy.backend.modules.clinic.repository.UserClinicRepository;
import com.medstudy.backend.modules.clinic.repository.UserUnlockedSkinRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpAccountRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClinicLootboxServiceTest {

    @Mock
    private UserXpAccountRepository userXpAccountRepository;

    @Mock
    private UserClinicRepository userClinicRepository;

    @Mock
    private ClinicCatalogItemRepository clinicCatalogItemRepository;

    @Mock
    private ClinicPlacedItemRepository clinicPlacedItemRepository;

    @Mock
    private UserXpTransactionRepository userXpTransactionRepository;

    @Mock
    private LootboxOpeningLogRepository lootboxOpeningLogRepository;

    @Mock
    private UserUnlockedSkinRepository userUnlockedSkinRepository;

    @Mock
    private Random mockRandom;

    private ClinicLootboxService lootboxService;

    private final UUID userId = UUID.randomUUID();
    private final UUID clinicId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        lootboxService = new ClinicLootboxService(
                userXpAccountRepository,
                userClinicRepository,
                clinicCatalogItemRepository,
                clinicPlacedItemRepository,
                userXpTransactionRepository,
                lootboxOpeningLogRepository,
                userUnlockedSkinRepository,
                mockRandom
        );
    }

    @Test
    @DisplayName("P-094: Should list all 3 official tiers with costs and public probabilities")
    void shouldListAllThreeTiersWithPublicProbabilities() {
        List<LootboxTierResponseDto> tiers = lootboxService.getAvailableTiers();

        assertEquals(3, tiers.size());

        LootboxTierResponseDto t1 = tiers.get(0);
        assertEquals("TIER_1_RESIDENT", t1.getTier());
        assertEquals(500, t1.getCostXp());
        assertEquals("COMMON", t1.getMinRarityGuaranteed());
        assertEquals(60.0, t1.getProbabilities().getCommon());
        assertEquals(30.0, t1.getProbabilities().getRare());
        assertEquals(9.0, t1.getProbabilities().getEpic());
        assertEquals(1.0, t1.getProbabilities().getLegendary());

        LootboxTierResponseDto t2 = tiers.get(1);
        assertEquals("TIER_2_SPECIALIST", t2.getTier());
        assertEquals(1500, t2.getCostXp());
        assertEquals("RARE", t2.getMinRarityGuaranteed());
        assertEquals(0.0, t2.getProbabilities().getCommon());
        assertEquals(65.0, t2.getProbabilities().getRare());

        LootboxTierResponseDto t3 = tiers.get(2);
        assertEquals("TIER_3_CHIEF_OF_STAFF", t3.getTier());
        assertEquals(4000, t3.getCostXp());
        assertEquals("EPIC", t3.getMinRarityGuaranteed());
        assertEquals(0.0, t3.getProbabilities().getCommon());
        assertEquals(0.0, t3.getProbabilities().getRare());
        assertEquals(75.0, t3.getProbabilities().getEpic());
        assertEquals(25.0, t3.getProbabilities().getLegendary());
    }

    @Test
    @DisplayName("P-094: Should open lootbox successfully, debit XP under pessimistic lock, and add item to inventory")
    void shouldOpenLootboxSuccessfullyWhenSufficientXpAndNewItem() {
        UserXpAccount account = new UserXpAccount(userId, 5000L, 2000L, 3, LocalDate.now());
        UserClinic clinic = new UserClinic(userId, "Clínica Teste", 1, 4, 4, "clean_modern");
        clinic.setId(clinicId);

        ClinicCatalogItem rareItem = new ClinicCatalogItem(
                "ped_maca_foguete_retro", "Maca Foguete Espacial Retrô", "pediatria",
                3400, 2, 2, 1, "FLOOR", true, null, "ped_maca_foguete_retro",
                ItemRarity.RARE, true
        );

        when(userXpAccountRepository.findByUserIdForUpdate(userId)).thenReturn(Optional.of(account));
        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(new ArrayList<>());
        when(clinicCatalogItemRepository.findAll()).thenReturn(List.of(rareItem));

        // Mock roll: 0.70 * 100 = 70.0 -> For TIER_1_RESIDENT (60-90) is RARE
        when(mockRandom.nextDouble()).thenReturn(0.70);
        when(mockRandom.nextInt(anyInt())).thenReturn(0);

        LootboxOpenResponseDto response = lootboxService.openLootbox(userId, LootboxTier.TIER_1_RESIDENT);

        assertNotNull(response);
        assertEquals("TIER_1_RESIDENT", response.getTier());
        assertEquals(500, response.getCostXp());
        assertEquals("ped_maca_foguete_retro", response.getDroppedItem().getId());
        assertEquals(ItemRarity.RARE, response.getDroppedItem().getRarity());
        assertFalse(response.isDuplicate());
        assertEquals(0, response.getCashbackXpAwarded());
        assertEquals(1500L, response.getCurrentXpAfter()); // 2000 - 500
        assertEquals(5000L, response.getLifetimeXp()); // Lifetime untouched

        // Verify entity persisted in inventory with isPlaced=false
        ArgumentCaptor<ClinicPlacedItem> placedCaptor = ArgumentCaptor.forClass(ClinicPlacedItem.class);
        verify(clinicPlacedItemRepository).save(placedCaptor.capture());
        ClinicPlacedItem placed = placedCaptor.getValue();
        assertEquals("ped_maca_foguete_retro", placed.getCatalogItemId());
        assertFalse(placed.isPlaced());

        // Verify audit log
        ArgumentCaptor<LootboxOpeningLog> logCaptor = ArgumentCaptor.forClass(LootboxOpeningLog.class);
        verify(lootboxOpeningLogRepository).save(logCaptor.capture());
        LootboxOpeningLog log = logCaptor.getValue();
        assertEquals(userId, log.getUserId());
        assertEquals("TIER_1_RESIDENT", log.getBoxTier());
        assertEquals("ped_maca_foguete_retro", log.getItemIdDropped());
        assertFalse(log.isDuplicate());
        assertEquals(0, log.getCashbackXpAwarded());
    }

    @Test
    @DisplayName("P-080 & P-094: Should reject lootbox opening when current_xp is insufficient (422 Unprocessable)")
    void shouldRejectOpeningWhenInsufficientCurrentXp() {
        UserXpAccount account = new UserXpAccount(userId, 5000L, 300L, 1, LocalDate.now());
        when(userXpAccountRepository.findByUserIdForUpdate(userId)).thenReturn(Optional.of(account));

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> lootboxService.openLootbox(userId, LootboxTier.TIER_1_RESIDENT) // requires 500 XP
        );

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, ex.getStatusCode());
        assertTrue(ex.getReason().contains("Saldo de XP insuficiente"));

        // Guarantee no balance changes or logs
        verify(userXpAccountRepository, never()).save(any());
        verify(lootboxOpeningLogRepository, never()).save(any());
        verify(clinicPlacedItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("P-095: Should detect duplicate item, award cashback according to rarity, and not add redundant item")
    void shouldAwardCashbackWhenDroppedItemIsDuplicate() {
        UserXpAccount account = new UserXpAccount(userId, 10000L, 2000L, 5, LocalDate.now());
        UserClinic clinic = new UserClinic(userId, "Clínica Teste", 2, 6, 6, "clean_modern");
        clinic.setId(clinicId);

        ClinicCatalogItem epicItem = new ClinicCatalogItem(
                "rec_mascote_husky_dr_neve", "Husky Terapêutico Dr. Neve", "recepcao",
                8900, 4, 1, 1, "FLOOR", true, null, "rec_mascote_husky_dr_neve",
                ItemRarity.EPIC, true
        );

        ClinicPlacedItem alreadyOwned = new ClinicPlacedItem(clinicId, "rec_mascote_husky_dr_neve", 1, 1, 0, true);

        when(userXpAccountRepository.findByUserIdForUpdate(userId)).thenReturn(Optional.of(account));
        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(List.of(alreadyOwned));
        when(clinicCatalogItemRepository.findAll()).thenReturn(List.of(epicItem));

        // For TIER_2_SPECIALIST (cost 1500 XP):
        // roll 0.70 * 100 = 70.0 -> in range [65, 93) -> EPIC!
        when(mockRandom.nextDouble()).thenReturn(0.70);
        when(mockRandom.nextInt(anyInt())).thenReturn(0);

        LootboxOpenResponseDto response = lootboxService.openLootbox(userId, LootboxTier.TIER_2_SPECIALIST);

        assertNotNull(response);
        assertTrue(response.isDuplicate());
        // Epic cashback is 1500 XP!
        assertEquals(1500, response.getCashbackXpAwarded());
        // Balance: 2000 - 1500 (cost) + 1500 (cashback) = 2000
        assertEquals(2000L, response.getCurrentXpAfter());

        // PlacedItemRepository.save should NOT be called for duplicate
        verify(clinicPlacedItemRepository, never()).save(any());

        // Verify two transactions: LOOTBOX_OPEN and LOOTBOX_DUPLICATE_CASHBACK
        verify(userXpTransactionRepository, times(2)).save(any(UserXpTransaction.class));

        // Verify audit log has isDuplicate = true and cashback awarded
        ArgumentCaptor<LootboxOpeningLog> logCaptor = ArgumentCaptor.forClass(LootboxOpeningLog.class);
        verify(lootboxOpeningLogRepository).save(logCaptor.capture());
        LootboxOpeningLog log = logCaptor.getValue();
        assertTrue(log.isDuplicate());
        assertEquals(1500, log.getCashbackXpAwarded());
    }

    @Test
    @DisplayName("P-094: Probability guarantees - Tier 2 never yields COMMON and Tier 3 yields only EPIC or LEGENDARY")
    void shouldRespectTierProbabilityGuarantees() {
        // Tier 2 with roll 0.0 -> must be RARE, not COMMON
        when(mockRandom.nextDouble()).thenReturn(0.0);
        assertEquals(ItemRarity.RARE, lootboxService.drawRarityForTier(LootboxTier.TIER_2_SPECIALIST));

        // Tier 3 with roll 0.0 -> must be EPIC, not COMMON or RARE
        assertEquals(ItemRarity.EPIC, lootboxService.drawRarityForTier(LootboxTier.TIER_3_CHIEF_OF_STAFF));

        // Tier 3 with roll 0.80 -> must be LEGENDARY (>= 75%)
        when(mockRandom.nextDouble()).thenReturn(0.80);
        assertEquals(ItemRarity.LEGENDARY, lootboxService.drawRarityForTier(LootboxTier.TIER_3_CHIEF_OF_STAFF));
    }

    @Test
    @DisplayName("P-094: Daily free lootbox opens for 0 XP and prevents double claim on the same day")
    void shouldOpenDailyFreeLootboxOncePerDay() {
        UserXpAccount account = new UserXpAccount(userId, 5000L, 2000L, 3, LocalDate.now());
        UserClinic clinic = new UserClinic(userId, "Clínica Teste", 1, 4, 4, "clean_modern");
        clinic.setId(clinicId);

        ClinicCatalogItem commonItem = new ClinicCatalogItem(
                "item_livro_harrison", "Tratado Harrison", "clinica",
                300, 1, 1, 1, "FLOOR", true, null, "item_livro_harrison",
                ItemRarity.COMMON, false
        );

        when(userXpAccountRepository.findByUserIdForUpdate(userId)).thenReturn(Optional.of(account));
        when(userClinicRepository.findByUserId(userId)).thenReturn(Optional.of(clinic));
        when(clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinicId)).thenReturn(new ArrayList<>());
        when(clinicCatalogItemRepository.findAll()).thenReturn(List.of(commonItem));

        when(mockRandom.nextDouble()).thenReturn(0.10); // 10% -> TIER_1_RESIDENT
        when(mockRandom.nextInt(anyInt())).thenReturn(0);

        LootboxOpenResponseDto response = lootboxService.openDailyFreeLootbox(userId);

        assertNotNull(response);
        assertEquals(0, response.getCostXp()); // Custo 0 XP
        assertTrue(response.isDailyFree());
        assertEquals(2000L, response.getCurrentXpAfter()); // Nenhum XP debitado
        assertEquals(LocalDate.now(), clinic.getLastFreeLootboxDate());

        // Segunda tentativa no mesmo dia deve lançar 409 CONFLICT
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                lootboxService.openDailyFreeLootbox(userId)
        );
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }
}
