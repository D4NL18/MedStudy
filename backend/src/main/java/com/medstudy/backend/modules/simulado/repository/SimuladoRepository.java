package com.medstudy.backend.modules.simulado.repository;

import com.medstudy.backend.modules.simulado.entity.Simulado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing Simulado entities.
 */
@Repository
public interface SimuladoRepository extends JpaRepository<Simulado, UUID>, JpaSpecificationExecutor<Simulado> {

    /**
     * Finds all mock exams associated with a specific user.
     *
     * @param userId the UUID of the user
     * @return a list of mock exams belonging to the user
     */
    @Query("SELECT s FROM Simulado s WHERE s.user.id = :userId")
    List<Simulado> findAllByUserId(@Param("userId") UUID userId);

    /**
     * Finds the most recent mock exam for a user by institution.
     *
     * @param userId the UUID of the user
     * @param instituicao the name of the institution
     * @return an Optional containing the latest mock exam if found
     */
    Optional<Simulado> findFirstByUserIdAndInstituicaoIgnoreCaseOrderByCreatedAtDesc(UUID userId, String instituicao);

    /**
     * Checks if the user has completed any mock exam flawlessly (all correct answers).
     *
     * @param userId the UUID of the user
     * @return true if a flawless mock exam exists for the user, false otherwise
     */
    @Query("SELECT COUNT(s) > 0 FROM Simulado s WHERE s.user.id = :userId " +
           "AND (s.cmAcertos + s.cirAcertos + s.pedAcertos + s.goAcertos + s.prevAcertos) = " +
           "(s.cmTotal + s.cirTotal + s.pedTotal + s.goTotal + s.prevTotal) " +
           "AND (s.cmTotal + s.cirTotal + s.pedTotal + s.goTotal + s.prevTotal) > 0")
    boolean existsFlawlessSimulado(@Param("userId") UUID userId);

    /**
     * Counts the total number of mock exams completed by a user.
     *
     * @param userId the UUID of the user
     * @return the count of mock exams
     */
    long countByUserId(UUID userId);
}
