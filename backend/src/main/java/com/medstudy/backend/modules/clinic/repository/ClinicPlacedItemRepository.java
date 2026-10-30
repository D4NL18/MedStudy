package com.medstudy.backend.modules.clinic.repository;

import com.medstudy.backend.modules.clinic.entity.ClinicPlacedItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClinicPlacedItemRepository extends JpaRepository<ClinicPlacedItem, UUID> {
    List<ClinicPlacedItem> findByClinicIdOrderByPlacedAtAsc(UUID clinicId);
    List<ClinicPlacedItem> findByClinicIdAndIsPlacedTrueOrderByPlacedAtAsc(UUID clinicId);
}
