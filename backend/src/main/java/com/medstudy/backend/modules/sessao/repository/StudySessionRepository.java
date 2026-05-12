package com.medstudy.backend.modules.sessao.repository;

import com.medstudy.backend.modules.sessao.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, UUID>, JpaSpecificationExecutor<StudySession> {

    @Query("SELECT SUM(s.qtsFeitas) FROM StudySession s WHERE s.user.id = :userId")
    Long sumTotalQuestionsByUserId(@Param("userId") UUID userId);

    @Query("SELECT SUM(s.qtsCorretas) FROM StudySession s WHERE s.user.id = :userId")
    Long sumTotalCorrectByUserId(@Param("userId") UUID userId);

    @Query("SELECT SUM(s.qtsFeitas) FROM StudySession s WHERE s.user.id = :userId AND MONTH(s.dataSessao) = :month AND YEAR(s.dataSessao) = :year")
    Long sumTotalQuestionsByUserIdAndMonth(@Param("userId") UUID userId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(s.qtsCorretas) FROM StudySession s WHERE s.user.id = :userId AND MONTH(s.dataSessao) = :month AND YEAR(s.dataSessao) = :year")
    Long sumTotalCorrectByUserIdAndMonth(@Param("userId") UUID userId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);

    @Query("SELECT DISTINCT s.dataSessao FROM StudySession s WHERE s.user.id = :userId ORDER BY s.dataSessao DESC")
    List<LocalDate> findDistinctSessionDatesByUserId(@Param("userId") UUID userId);

    @Query("SELECT s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas), COUNT(s) " +
           "FROM StudySession s WHERE s.user.id = :userId AND s.dataSessao >= :since GROUP BY s.grandeArea")
    List<Object[]> aggregateByAreaSince(@Param("userId") UUID userId, @Param("since") LocalDate since);

    @Query("SELECT s.tema, s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas), COUNT(s) " +
           "FROM StudySession s WHERE s.user.id = :userId AND s.dataSessao >= :since GROUP BY s.tema, s.grandeArea")
    List<Object[]> aggregateByTopicSince(@Param("userId") UUID userId, @Param("since") LocalDate since);

    @Query("SELECT s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas), COUNT(s) " +
           "FROM StudySession s WHERE s.user.id = :userId GROUP BY s.grandeArea")
    List<Object[]> aggregateByAreaTotal(@Param("userId") UUID userId);

    @Query("SELECT s.tema, s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas), COUNT(s) " +
           "FROM StudySession s WHERE s.user.id = :userId GROUP BY s.tema, s.grandeArea")
    List<Object[]> aggregateByTopicTotal(@Param("userId") UUID userId);

    @Query("SELECT s.tema, s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas) " +
           "FROM StudySession s WHERE s.user.id = :userId AND s.dataSessao >= :since " +
           "GROUP BY s.tema, s.grandeArea " +
           "ORDER BY (SUM(s.qtsFeitas) - SUM(s.qtsCorretas)) * 1.0 / SUM(s.qtsFeitas) DESC")
    List<Object[]> findTopErrorsByUserIdSince(@Param("userId") UUID userId, @Param("since") LocalDate since);

    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.user.id = :userId AND s.revisaoConcluida = false AND s.dataProximaRevisao <= :today")
    long countPendingRevisions(@Param("userId") UUID userId, @Param("today") LocalDate today);

    long countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(UUID userId, LocalDate date);
    long countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(UUID userId, LocalDate date);
    long countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(UUID userId, LocalDate date);
    long countByUserIdAndRevisaoConcluidaTrue(UUID userId);

    List<StudySession> findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(UUID userId, LocalDate date);
    List<StudySession> findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(UUID userId, LocalDate date);
    List<StudySession> findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(UUID userId, LocalDate date);
    List<StudySession> findByUserIdAndRevisaoConcluidaTrue(UUID userId);
}
