package com.medstudy.backend.modules.revision.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import com.medstudy.backend.modules.aula.repository.LessonRepository;
import com.medstudy.backend.modules.revision.dto.DailyLoadDto;
import com.medstudy.backend.modules.revision.dto.RedistributionPreviewResponse;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.revision.entity.RedistributionDraft;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.revision.repository.RedistributionDraftRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.service.UserSettingsService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class RevisionRedistributionService {

    private final FlashcardRepository flashcardRepository;
    private final LessonRepository lessonRepository;
    private final RedistributionDraftRepository draftRepository;
    private final UserSettingsService userSettingsService;
    private final ObjectMapper objectMapper;
    private final StudySessionRepository studySessionRepository;

    public RevisionRedistributionService(FlashcardRepository flashcardRepository,
                                          LessonRepository lessonRepository,
                                          RedistributionDraftRepository draftRepository,
                                          UserSettingsService userSettingsService,
                                          ObjectMapper objectMapper,
                                          StudySessionRepository studySessionRepository) {
        this.flashcardRepository = flashcardRepository;
        this.lessonRepository = lessonRepository;
        this.draftRepository = draftRepository;
        this.userSettingsService = userSettingsService;
        this.objectMapper = objectMapper;
        this.studySessionRepository = studySessionRepository;
    }

    @Transactional
    public RedistributionPreviewResponse generatePreview(LocalDate targetEndDate) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        LocalDate today = LocalDate.now();
        if (!targetEndDate.isAfter(today)) {
            throw new IllegalArgumentException("Target end date must be in the future.");
        }

        // Redistribute ALL study sessions scheduled up to the target date (including overdue ones)
        List<StudySession> sessionsToRedistribute = studySessionRepository.findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(user.getId(), targetEndDate.plusDays(1));
        
        if (sessionsToRedistribute.isEmpty()) {
            return RedistributionPreviewResponse.builder()
                    .totalRevisionsRedistributed(0)
                    .daysSpread(0)
                    .warningLimitExceeded(false)
                    .dailyLoads(Collections.emptyList())
                    .build();
        }

        Map<String, Lesson> lessonCache = new HashMap<>();

        sessionsToRedistribute.sort(Comparator.comparing((StudySession s) -> getPriorityOrder(s, lessonCache, user))
                .thenComparing(s -> getPercentAcerto(s, lessonCache, user))
                .thenComparing(StudySession::getDataProximaRevisao, Comparator.nullsLast(Comparator.naturalOrder())));

        long daysToSpread = ChronoUnit.DAYS.between(today, targetEndDate);
        if (daysToSpread == 0) {
            daysToSpread = 1;
        }

        int totalSessions = sessionsToRedistribute.size();
        int maxReviewsPerDay = userSettingsService.getCurrentUserMaxReviewsPerDay();
        
        int basePerDay = (int) (totalSessions / daysToSpread);
        int remainder = (int) (totalSessions % daysToSpread);
        
        boolean warningLimitExceeded = (basePerDay > maxReviewsPerDay || (basePerDay == maxReviewsPerDay && remainder > 0));

        Map<UUID, LocalDate> draftMap = new HashMap<>();
        int currentSessionIndex = 0;
        
        // Se a data limite ganha, ignoramos o maxReviewsPerDay para a distribuição em si
        for (int dayOffset = 0; dayOffset < daysToSpread; dayOffset++) {
            int sessionsForThisDay = basePerDay + (dayOffset < remainder ? 1 : 0);
            LocalDate newDate = today.plusDays(dayOffset);
            
            for (int i = 0; i < sessionsForThisDay; i++) {
                if (currentSessionIndex < totalSessions) {
                    StudySession session = sessionsToRedistribute.get(currentSessionIndex++);
                    draftMap.put(session.getId(), newDate);
                }
            }
        }

        Map<LocalDate, Integer> originalCounts = new HashMap<>();
        Map<LocalDate, Integer> draftCounts = new HashMap<>();

        for (StudySession s : sessionsToRedistribute) {
            LocalDate revDate = s.getDataProximaRevisao();
            if (revDate != null && revDate.isBefore(today)) {
                originalCounts.merge(today, 1, Integer::sum);
            } else if (revDate != null) {
                originalCounts.merge(revDate, 1, Integer::sum);
            } else {
                originalCounts.merge(today, 1, Integer::sum);
            }
        }

        for (LocalDate date : draftMap.values()) {
            draftCounts.merge(date, 1, Integer::sum);
        }

        List<DailyLoadDto> dailyLoads = new ArrayList<>();
        for (int dayOffset = 0; dayOffset < daysToSpread; dayOffset++) {
            LocalDate currentDate = today.plusDays(dayOffset);
            int original = originalCounts.getOrDefault(currentDate, 0);
            int newC = draftCounts.getOrDefault(currentDate, 0);
            dailyLoads.add(new DailyLoadDto(currentDate, original, newC));
        }

        try {
            String draftJson = objectMapper.writeValueAsString(draftMap);
            RedistributionDraft draft = new RedistributionDraft();
            draft.setUserId(user.getId());
            draft.setDraftData(draftJson);
            draft = draftRepository.save(draft);

            return RedistributionPreviewResponse.builder()
                    .draftId(draft.getId())
                    .warningLimitExceeded(warningLimitExceeded)
                    .totalRevisionsRedistributed(totalSessions)
                    .daysSpread((int) daysToSpread)
                    .dailyLoads(dailyLoads)
                    .build();

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error creating draft", e);
        }
    }

    @Transactional
    public void applyDraft(UUID draftId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        RedistributionDraft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new EntityNotFoundException("Draft not found"));

        if (!draft.getUserId().equals(user.getId())) {
            throw new EntityNotFoundException("Draft not found");
        }

        try {
            Map<UUID, String> draftMapString = objectMapper.readValue(draft.getDraftData(), new TypeReference<>() {});
            Map<UUID, LocalDate> draftMap = new HashMap<>();
            draftMapString.forEach((k, v) -> draftMap.put(k, LocalDate.parse(v)));

            List<StudySession> sessionsToUpdate = studySessionRepository.findAllById(draftMap.keySet());

            for (StudySession session : sessionsToUpdate) {
                if (session.getUser().getId().equals(user.getId())) {
                    LocalDate newDate = draftMap.get(session.getId());
                    if (newDate != null) {
                        session.setDataProximaRevisao(newDate);
                    }
                }
            }
            studySessionRepository.saveAll(sessionsToUpdate);
            draftRepository.delete(draft);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error applying draft", e);
        }
    }

    private Lesson getLessonForStudySession(StudySession session, Map<String, Lesson> cache, User user) {
        if (session.getTema() == null) {
            return null;
        }
        return cache.computeIfAbsent(session.getTema(), tema -> 
                lessonRepository.findByUserAndTema(user, tema).orElse(null)
        );
    }

    private int getPriorityOrder(StudySession session, Map<String, Lesson> cache, User user) {
        Lesson lesson = getLessonForStudySession(session, cache, user);
        if (lesson == null || lesson.getPrioridade() == null) {
            return 3;
        }
        return switch (lesson.getPrioridade()) {
            case DIAMANTE -> 0;
            case ALTA -> 1;
            case MEDIA -> 2;
            case BAIXA -> 3;
        };
    }

    private int getPercentAcerto(StudySession session, Map<String, Lesson> cache, User user) {
        Lesson lesson = getLessonForStudySession(session, cache, user);
        if (lesson == null || lesson.getPercentAcerto() == null) {
            return 100;
        }
        return lesson.getPercentAcerto();
    }
}
