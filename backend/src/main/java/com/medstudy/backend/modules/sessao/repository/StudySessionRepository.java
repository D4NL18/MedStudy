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

/**
 * Repository interface for managing StudySession entities.
 */
@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, UUID>, JpaSpecificationExecutor<StudySession> {

    /**
     * Sums total questions done by user.
     *
     * @param userId the user ID
     * @return sum of total questions
     */
    @Query("SELECT SUM(s.qtsFeitas) FROM StudySession s WHERE s.user.id = :userId")
    Long sumTotalQuestionsByUserId(@Param("userId") UUID userId);

    /**
     * Sums total correct questions by user.
     *
     * @param userId the user ID
     * @return sum of correct questions
     */
    @Query("SELECT SUM(s.qtsCorretas) FROM StudySession s WHERE s.user.id = :userId")
    Long sumTotalCorrectByUserId(@Param("userId") UUID userId);

    /**
     * Checks if a user has a precision greater than or equal to a specified percentage.
     *
     * @param userId the user ID
     * @param minQuestions minimum number of questions
     * @param minPercent minimum precision percentage
     * @return true if criteria is met, false otherwise
     */
    @Query("SELECT COUNT(s) > 0 FROM StudySession s WHERE s.user.id = :userId AND s.qtsFeitas >= :minQuestions AND (s.qtsCorretas * 100.0 / s.qtsFeitas) >= :minPercent")
    boolean existsByPrecisionGreaterThanEqual(@Param("userId") UUID userId, @Param("minQuestions") int minQuestions, @Param("minPercent") double minPercent);

    /**
     * Sums total questions done by user in a specific month and year.
     *
     * @param userId the user ID
     * @param month the month
     * @param year the year
     * @return sum of questions
     */
    @Query("SELECT SUM(s.qtsFeitas) FROM StudySession s WHERE s.user.id = :userId AND MONTH(s.dataSessao) = :month AND YEAR(s.dataSessao) = :year")
    Long sumTotalQuestionsByUserIdAndMonth(@Param("userId") UUID userId, @Param("month") int month, @Param("year") int year);

    /**
     * Sums total correct questions by user in a specific month and year.
     *
     * @param userId the user ID
     * @param month the month
     * @param year the year
     * @return sum of correct questions
     */
    @Query("SELECT SUM(s.qtsCorretas) FROM StudySession s WHERE s.user.id = :userId AND MONTH(s.dataSessao) = :month AND YEAR(s.dataSessao) = :year")
    Long sumTotalCorrectByUserIdAndMonth(@Param("userId") UUID userId, @Param("month") int month, @Param("year") int year);

    /**
     * Counts the number of study sessions by user.
     *
     * @param userId the user ID
     * @return count of sessions
     */
    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);

    /**
     * Finds distinct session dates for a user.
     *
     * @param userId the user ID
     * @return list of distinct session dates
     */
    @Query("SELECT DISTINCT s.dataSessao FROM StudySession s WHERE s.user.id = :userId ORDER BY s.dataSessao DESC")
    List<LocalDate> findDistinctSessionDatesByUserId(@Param("userId") UUID userId);

    /**
     * Aggregates study session data by major area since a given date.
     *
     * @param userId the user ID
     * @param since the start date
     * @return aggregated data
     */
    @Query("SELECT s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas), COUNT(s) " +
           "FROM StudySession s WHERE s.user.id = :userId AND s.dataSessao >= :since GROUP BY s.grandeArea")
    List<Object[]> aggregateByAreaSince(@Param("userId") UUID userId, @Param("since") LocalDate since);

    /**
     * Aggregates study session data by topic since a given date.
     *
     * @param userId the user ID
     * @param since the start date
     * @return aggregated data
     */
    @Query("SELECT s.tema, s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas), COUNT(s) " +
           "FROM StudySession s WHERE s.user.id = :userId AND s.dataSessao >= :since GROUP BY s.tema, s.grandeArea")
    List<Object[]> aggregateByTopicSince(@Param("userId") UUID userId, @Param("since") LocalDate since);

    /**
     * Aggregates total study session data by major area.
     *
     * @param userId the user ID
     * @return aggregated data
     */
    @Query("SELECT s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas), COUNT(s) " +
           "FROM StudySession s WHERE s.user.id = :userId GROUP BY s.grandeArea")
    List<Object[]> aggregateByAreaTotal(@Param("userId") UUID userId);

    /**
     * Aggregates total study session data by topic.
     *
     * @param userId the user ID
     * @return aggregated data
     */
    @Query("SELECT s.tema, s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas), COUNT(s) " +
           "FROM StudySession s WHERE s.user.id = :userId GROUP BY s.tema, s.grandeArea")
    List<Object[]> aggregateByTopicTotal(@Param("userId") UUID userId);

    /**
     * Finds topics with the highest error rates since a given date.
     *
     * @param userId the user ID
     * @param since the start date
     * @return list of topics ordered by error rate
     */
    @Query("SELECT s.tema, s.grandeArea, SUM(s.qtsFeitas), SUM(s.qtsCorretas) " +
           "FROM StudySession s WHERE s.user.id = :userId AND s.dataSessao >= :since " +
           "GROUP BY s.tema, s.grandeArea " +
           "ORDER BY (SUM(s.qtsFeitas) - SUM(s.qtsCorretas)) * 1.0 / SUM(s.qtsFeitas) DESC")
    List<Object[]> findTopErrorsByUserIdSince(@Param("userId") UUID userId, @Param("since") LocalDate since);

    /**
     * Counts the number of pending revisions for a user.
     *
     * @param userId the user ID
     * @param today current date
     * @return count of pending revisions
     */
    @Query("SELECT COUNT(s) FROM StudySession s WHERE s.user.id = :userId AND s.revisaoConcluida = false AND s.dataProximaRevisao <= :today")
    long countPendingRevisions(@Param("userId") UUID userId, @Param("today") LocalDate today);

    /**
     * Counts past due revisions.
     *
     * @param userId the user ID
     * @param date the cutoff date
     * @return count of past due revisions
     */
    long countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(UUID userId, LocalDate date);

    /**
     * Counts revisions due on a specific date.
     *
     * @param userId the user ID
     * @param date the specific date
     * @return count of revisions due
     */
    long countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(UUID userId, LocalDate date);

    /**
     * Counts upcoming revisions.
     *
     * @param userId the user ID
     * @param date the cutoff date
     * @return count of upcoming revisions
     */
    long countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(UUID userId, LocalDate date);

    /**
     * Counts completed revisions.
     *
     * @param userId the user ID
     * @return count of completed revisions
     */
    long countByUserIdAndRevisaoConcluidaTrue(UUID userId);

    /**
     * Finds past due revisions.
     *
     * @param userId the user ID
     * @param date the cutoff date
     * @return list of past due revisions
     */
    List<StudySession> findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(UUID userId, LocalDate date);

    /**
     * Finds revisions due on a specific date.
     *
     * @param userId the user ID
     * @param date the specific date
     * @return list of revisions due
     */
    List<StudySession> findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(UUID userId, LocalDate date);

    /**
     * Finds upcoming revisions.
     *
     * @param userId the user ID
     * @param date the cutoff date
     * @return list of upcoming revisions
     */
    List<StudySession> findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(UUID userId, LocalDate date);

    /**
     * Finds completed revisions.
     *
     * @param userId the user ID
     * @return list of completed revisions
     */
    List<StudySession> findByUserIdAndRevisaoConcluidaTrue(UUID userId);

    /**
     * Sums total questions by user in a date range.
     *
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return sum of questions
     */
    @Query("SELECT COALESCE(SUM(s.qtsFeitas), 0) FROM StudySession s WHERE s.user.id = :userId AND s.dataSessao >= :startDate AND s.dataSessao <= :endDate")
    Long sumTotalQuestionsByUserIdAndDateRange(@Param("userId") UUID userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Sums total correct questions by user in a date range.
     *
     * @param userId the user ID
     * @param startDate the start date
     * @param endDate the end date
     * @return sum of correct questions
     */
    @Query("SELECT COALESCE(SUM(s.qtsCorretas), 0) FROM StudySession s WHERE s.user.id = :userId AND s.dataSessao >= :startDate AND s.dataSessao <= :endDate")
    Long sumTotalCorrectQuestionsByUserIdAndDateRange(@Param("userId") UUID userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
