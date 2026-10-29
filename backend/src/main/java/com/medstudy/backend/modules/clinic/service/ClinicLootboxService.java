package com.medstudy.backend.modules.clinic.service;

import com.medstudy.backend.modules.clinic.dto.LootboxOpenResponseDto;
import com.medstudy.backend.modules.clinic.dto.LootboxProbabilitiesDto;
import com.medstudy.backend.modules.clinic.dto.LootboxTierResponseDto;
import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;
import com.medstudy.backend.modules.clinic.entity.ClinicPlacedItem;
import com.medstudy.backend.modules.clinic.entity.ItemRarity;
import com.medstudy.backend.modules.clinic.entity.LootboxOpeningLog;
import com.medstudy.backend.modules.clinic.entity.LootboxTier;
import com.medstudy.backend.modules.clinic.entity.StudyActionType;
import com.medstudy.backend.modules.clinic.entity.UserClinic;
import com.medstudy.backend.modules.clinic.entity.UserUnlockedSkin;
import com.medstudy.backend.modules.clinic.entity.UserXpAccount;
import com.medstudy.backend.modules.clinic.entity.UserXpTransaction;
import com.medstudy.backend.modules.clinic.repository.ClinicCatalogItemRepository;
import com.medstudy.backend.modules.clinic.repository.ClinicPlacedItemRepository;
import com.medstudy.backend.modules.clinic.repository.LootboxOpeningLogRepository;
import com.medstudy.backend.modules.clinic.repository.UserClinicRepository;
import com.medstudy.backend.modules.clinic.repository.UserUnlockedSkinRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpAccountRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpTransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * Core service for Medical Lootbox openings, rarity distribution and ACID ledger integrity (P-093, P-094, P-095).
 */
@Service
public class ClinicLootboxService {

    public static final int CASHBACK_COMMON = 150;
    public static final int CASHBACK_RARE = 500;
    public static final int CASHBACK_EPIC = 1500;
    public static final int CASHBACK_LEGENDARY = 3000;

    private final UserXpAccountRepository userXpAccountRepository;
    private final UserClinicRepository userClinicRepository;
    private final ClinicCatalogItemRepository clinicCatalogItemRepository;
    private final ClinicPlacedItemRepository clinicPlacedItemRepository;
    private final UserXpTransactionRepository userXpTransactionRepository;
    private final LootboxOpeningLogRepository lootboxOpeningLogRepository;
    private final UserUnlockedSkinRepository userUnlockedSkinRepository;

    private final Random random;

    public ClinicLootboxService(
            UserXpAccountRepository userXpAccountRepository,
            UserClinicRepository userClinicRepository,
            ClinicCatalogItemRepository clinicCatalogItemRepository,
            ClinicPlacedItemRepository clinicPlacedItemRepository,
            UserXpTransactionRepository userXpTransactionRepository,
            LootboxOpeningLogRepository lootboxOpeningLogRepository
    ) {
        this(
                userXpAccountRepository,
                userClinicRepository,
                clinicCatalogItemRepository,
                clinicPlacedItemRepository,
                userXpTransactionRepository,
                lootboxOpeningLogRepository,
                null,
                new SecureRandom()
        );
    }

    @org.springframework.beans.factory.annotation.Autowired
    public ClinicLootboxService(
            UserXpAccountRepository userXpAccountRepository,
            UserClinicRepository userClinicRepository,
            ClinicCatalogItemRepository clinicCatalogItemRepository,
            ClinicPlacedItemRepository clinicPlacedItemRepository,
            UserXpTransactionRepository userXpTransactionRepository,
            LootboxOpeningLogRepository lootboxOpeningLogRepository,
            UserUnlockedSkinRepository userUnlockedSkinRepository
    ) {
        this(
                userXpAccountRepository,
                userClinicRepository,
                clinicCatalogItemRepository,
                clinicPlacedItemRepository,
                userXpTransactionRepository,
                lootboxOpeningLogRepository,
                userUnlockedSkinRepository,
                new SecureRandom()
        );
    }

    public ClinicLootboxService(
            UserXpAccountRepository userXpAccountRepository,
            UserClinicRepository userClinicRepository,
            ClinicCatalogItemRepository clinicCatalogItemRepository,
            ClinicPlacedItemRepository clinicPlacedItemRepository,
            UserXpTransactionRepository userXpTransactionRepository,
            LootboxOpeningLogRepository lootboxOpeningLogRepository,
            UserUnlockedSkinRepository userUnlockedSkinRepository,
            Random random
    ) {
        this.userXpAccountRepository = userXpAccountRepository;
        this.userClinicRepository = userClinicRepository;
        this.clinicCatalogItemRepository = clinicCatalogItemRepository;
        this.clinicPlacedItemRepository = clinicPlacedItemRepository;
        this.userXpTransactionRepository = userXpTransactionRepository;
        this.lootboxOpeningLogRepository = lootboxOpeningLogRepository;
        this.userUnlockedSkinRepository = userUnlockedSkinRepository;
        this.random = random != null ? random : new SecureRandom();
    }

    /**
     * Lists the 3 official Lootbox tiers with metadata and transparent drop probabilities (P-094).
     */
    public List<LootboxTierResponseDto> getAvailableTiers() {
        return List.of(
                new LootboxTierResponseDto(
                        LootboxTier.TIER_1_RESIDENT.name(),
                        "Caixa do Residente",
                        "Ideal para iniciar a decoração com instrumentais básicos e móveis acolhedores de consultório.",
                        LootboxTier.TIER_1_RESIDENT.getCostXp(),
                        "#94A3B8",
                        "lootbox_tier1_resident",
                        ItemRarity.COMMON.name(),
                        new LootboxProbabilitiesDto(60.0, 30.0, 9.0, 1.0)
                ),
                new LootboxTierResponseDto(
                        LootboxTier.TIER_2_SPECIALIST.name(),
                        "Caixa do Especialista",
                        "Equipamentos especializados e peças de média sofisticação. Zero chance de itens comuns!",
                        LootboxTier.TIER_2_SPECIALIST.getCostXp(),
                        "#0284C7",
                        "lootbox_tier2_specialist",
                        ItemRarity.RARE.name(),
                        new LootboxProbabilitiesDto(0.0, 65.0, 28.0, 7.0)
                ),
                new LootboxTierResponseDto(
                        LootboxTier.TIER_3_CHIEF_OF_STAFF.name(),
                        "Caixa do Chefe de Ala",
                        "Acesso exclusivo aos equipamentos médicos mais nobres e relíquias lendárias da medicina.",
                        LootboxTier.TIER_3_CHIEF_OF_STAFF.getCostXp(),
                        "#F59E0B",
                        "lootbox_tier3_chief",
                        ItemRarity.EPIC.name(),
                        new LootboxProbabilitiesDto(0.0, 0.0, 75.0, 25.0)
                )
        );
    }

    /**
     * Opens a lootbox atomically under pessimistic lock, executes CSPRNG drop, handles duplicates
     * with cashback, and logs both financial transaction and drop audit record (P-080, P-093, P-094, P-095).
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public LootboxOpenResponseDto openLootbox(UUID userId, LootboxTier tier) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado.");
        }
        if (tier == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tier de Lootbox inválido.");
        }

        // 1. Lock pessimista para integridade ACID e prevenção contra double-spending
        UserXpAccount account = userXpAccountRepository.findByUserIdForUpdate(userId)
                .orElseGet(() -> userXpAccountRepository.findByIdForUpdate(userId)
                        .orElseGet(() -> {
                            UserXpAccount created = new UserXpAccount(userId, 0L, 0L, 0, null);
                            return userXpAccountRepository.save(created);
                        }));

        if (account.getCurrentXp() < tier.getCostXp()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Saldo de XP insuficiente para realizar esta operação."
            );
        }

        // 2. Débito do custo da caixa
        account.debitCurrentXp(tier.getCostXp());
        userXpAccountRepository.save(account);

        UserXpTransaction openTx = new UserXpTransaction(
                userId,
                -tier.getCostXp(),
                account.getCurrentXp(),
                StudyActionType.LOOTBOX_OPEN.name(),
                "Abertura de Caixa da Sorte: " + tier.getDisplayName()
        );
        userXpTransactionRepository.save(openTx);

        // 3. Sorteio de Raridade via CDF
        ItemRarity targetRarity = drawRarityForTier(tier);

        // 4. Seleção Uniforme de Item dentro do pool da raridade
        ClinicCatalogItem droppedItem = drawItemFromPool(targetRarity);

        // 5. Verificação de Posse / Duplicata
        UserClinic clinic = userClinicRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserClinic newClinic = new UserClinic(userId, "Minha Clínica", 1, 4, 4, "clean_modern");
                    return userClinicRepository.save(newClinic);
                });

        List<ClinicPlacedItem> existingItems = clinicPlacedItemRepository.findByClinicIdOrderByPlacedAtAsc(clinic.getId());
        boolean isDuplicate = existingItems.stream()
                .anyMatch(p -> p.getCatalogItemId().equalsIgnoreCase(droppedItem.getId()));

        if (!isDuplicate && userUnlockedSkinRepository != null) {
            if (userUnlockedSkinRepository.existsByUserIdAndSkinId(userId, droppedItem.getId())) {
                isDuplicate = true;
            }
        }

        int cashbackXpAwarded = 0;
        if (isDuplicate) {
            cashbackXpAwarded = getCashbackForRarity(droppedItem.getRarity());
            account.setCurrentXp(account.getCurrentXp() + cashbackXpAwarded);
            userXpAccountRepository.save(account);

            UserXpTransaction cashbackTx = new UserXpTransaction(
                    userId,
                    cashbackXpAwarded,
                    account.getCurrentXp(),
                    StudyActionType.LOOTBOX_DUPLICATE_CASHBACK.name(),
                    "Cashback por item duplicado em Lootbox: " + droppedItem.getName() + " (" + droppedItem.getRarity().name() + ")"
            );
            userXpTransactionRepository.save(cashbackTx);
        } else {
            // Adiciona ao inventário do estudante (placed = false)
            ClinicPlacedItem newPlaced = new ClinicPlacedItem(clinic.getId(), droppedItem.getId(), 0, 0, 0, false);
            clinicPlacedItemRepository.save(newPlaced);

            if (userUnlockedSkinRepository != null && ("SURFACE_WALL".equalsIgnoreCase(droppedItem.getPlacementType())
                    || "SURFACE_FLOOR".equalsIgnoreCase(droppedItem.getPlacementType()))) {
                if (!userUnlockedSkinRepository.existsByUserIdAndSkinId(userId, droppedItem.getId())) {
                    userUnlockedSkinRepository.save(new UserUnlockedSkin(userId, droppedItem.getPlacementType().toLowerCase(), droppedItem.getId()));
                }
            }
        }

        // 6. Registro de Auditoria Imutável do Sorteio
        LootboxOpeningLog auditLog = new LootboxOpeningLog(
                userId,
                tier.name(),
                tier.getCostXp(),
                droppedItem.getId(),
                droppedItem.getRarity().name(),
                isDuplicate,
                cashbackXpAwarded,
                LocalDateTime.now()
        );
        lootboxOpeningLogRepository.save(auditLog);

        return new LootboxOpenResponseDto(
                tier.name(),
                tier.getDisplayName(),
                tier.getCostXp(),
                droppedItem,
                isDuplicate,
                cashbackXpAwarded,
                account.getCurrentXp(),
                account.getLifetimeXp(),
                Instant.now()
        );
    }

    /**
     * CDF Probabilistic roll for given tier.
     */
    public ItemRarity drawRarityForTier(LootboxTier tier) {
        double roll = random.nextDouble() * 100.0;
        return switch (tier) {
            case TIER_1_RESIDENT -> {
                if (roll < 60.0) yield ItemRarity.COMMON;
                if (roll < 90.0) yield ItemRarity.RARE;
                if (roll < 99.0) yield ItemRarity.EPIC;
                yield ItemRarity.LEGENDARY;
            }
            case TIER_2_SPECIALIST -> {
                if (roll < 65.0) yield ItemRarity.RARE;
                if (roll < 93.0) yield ItemRarity.EPIC;
                yield ItemRarity.LEGENDARY;
            }
            case TIER_3_CHIEF_OF_STAFF -> {
                if (roll < 75.0) yield ItemRarity.EPIC;
                yield ItemRarity.LEGENDARY;
            }
        };
    }

    private ClinicCatalogItem drawItemFromPool(ItemRarity rarity) {
        List<ClinicCatalogItem> pool = clinicCatalogItemRepository.findByRarity(rarity);
        if (pool == null || pool.isEmpty()) {
            pool = ClinicService.OFFICIAL_CATALOG_ITEMS.stream()
                    .filter(i -> i.getRarity() == rarity)
                    .toList();
        }
        if (pool.isEmpty()) {
            pool = clinicCatalogItemRepository.findAll();
        }
        if (pool.isEmpty()) {
            pool = ClinicService.OFFICIAL_CATALOG_ITEMS;
        }

        int index = random.nextInt(pool.size());
        return pool.get(index);
    }

    public static int getCashbackForRarity(ItemRarity rarity) {
        if (rarity == null) return CASHBACK_COMMON;
        return switch (rarity) {
            case COMMON -> CASHBACK_COMMON;
            case RARE -> CASHBACK_RARE;
            case EPIC -> CASHBACK_EPIC;
            case LEGENDARY -> CASHBACK_LEGENDARY;
        };
    }
}
