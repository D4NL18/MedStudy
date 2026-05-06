package com.medstudy.backend.modules.simulado.repository;

import com.medstudy.backend.modules.simulado.entity.Simulado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SimuladoRepository extends JpaRepository<Simulado, UUID> {
}
