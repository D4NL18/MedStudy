package com.medstudy.backend.modules.clinic.repository;

import com.medstudy.backend.modules.clinic.entity.ClinicCatalogItem;
import com.medstudy.backend.modules.clinic.entity.ItemRarity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicCatalogItemRepository extends JpaRepository<ClinicCatalogItem, String> {
    List<ClinicCatalogItem> findAllByOrderByCategoryAscMinExpansionLevelAscCostXpAsc();
    List<ClinicCatalogItem> findByRarity(ItemRarity rarity);
    List<ClinicCatalogItem> findByRarityAndIsLootboxExclusive(ItemRarity rarity, boolean isLootboxExclusive);
}
