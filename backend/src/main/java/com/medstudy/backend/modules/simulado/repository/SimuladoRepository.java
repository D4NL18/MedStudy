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

@Repository
public interface SimuladoRepository extends JpaRepository<Simulado, UUID>, JpaSpecificationExecutor<Simulado> {

    @Query("SELECT s FROM Simulado s WHERE s.user.id = :userId")
    List<Simulado> findAllByUserId(@Param("userId") UUID userId);

    Optional<Simulado> findFirstByUserIdAndInstituicaoIgnoreCaseOrderByCreatedAtDesc(UUID userId, String instituicao);
}
