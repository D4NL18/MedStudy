package com.medstudy.backend.modules.sessao.repository;

import com.medstudy.backend.modules.sessao.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, UUID> {
}
