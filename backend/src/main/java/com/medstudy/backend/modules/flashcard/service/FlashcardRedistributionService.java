package com.medstudy.backend.modules.flashcard.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import com.medstudy.backend.modules.aula.repository.LessonRepository;
import com.medstudy.backend.modules.flashcard.dto.DailyLoadDto;
import com.medstudy.backend.modules.flashcard.dto.RedistributionPreviewResponse;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.RedistributionDraft;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.flashcard.repository.RedistributionDraftRepository;
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
public class FlashcardRedistributionService {

    private final FlashcardRepository flashcardRepository;
    private final LessonRepository lessonRepository;
    private final RedistributionDraftRepository draftRepository;
    private final UserSettingsService userSettingsService;
    private final ObjectMapper objectMapper;
    private final StudySessionRepository studySessionRepository;

    public FlashcardRedistributionService(FlashcardRepository flashcardRepository,
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

        List<Flashcard> overdueCards = flashcardRepository.findByUserIdAndProximaRevisaoBefore(user.getId(), today);
        if (overdueCards.isEmpty()) {
            return RedistributionPreviewResponse.builder()
                    .totalFlashcardsRedistributed(0)
                    .daysSpread(0)
                    .warningLimitExceeded(false)
                    .dailyLoads(Collections.emptyList())
                    .build();
        }

        Map<String, Lesson> lessonCache = new HashMap<>();

        overdueCards.sort(Comparator.comparing((Flashcard f) -> getPriorityOrder(f, lessonCache, user))
                .thenComparing(f -> getPercentAcerto(f, lessonCache, user))
                .thenComparing(Flashcard::getProximaRevisao, Comparator.nullsLast(Comparator.naturalOrder())));

        long daysToSpread = ChronoUnit.DAYS.between(today, targetEndDate);
        if (daysToSpread == 0) {
            daysToSpread = 1;
        }

        int totalCards = overdueCards.size();
        int maxReviewsPerDay = userSettingsService.getCurrentUserMaxReviewsPerDay();
        
        int basePerDay = (int) (totalCards / daysToSpread);
        int remainder = (int) (totalCards % daysToSpread);
        
        boolean warningLimitExceeded = (basePerDay > maxReviewsPerDay || (basePerDay == maxReviewsPerDay && remainder > 0));

        Map<UUID, LocalDate> draftMap = new HashMap<>();
        int currentCardIndex = 0;
        
        // Se a data limite ganha, ignoramos o maxReviewsPerDay para a distribuição em si
        for (int dayOffset = 0; dayOffset < daysToSpread; dayOffset++) {
            int cardsForThisDay = basePerDay + (dayOffset < remainder ? 1 : 0);
            LocalDate newDate = today.plusDays(dayOffset);
            
            for (int i = 0; i < cardsForThisDay; i++) {
                if (currentCardIndex < totalCards) {
                    Flashcard flashcard = overdueCards.get(currentCardIndex++);
                    draftMap.put(flashcard.getId(), newDate);
                }
            }
        }

        Map<LocalDate, Integer> originalCounts = new HashMap<>();
        Map<LocalDate, Integer> draftCounts = new HashMap<>();

        List<Flashcard> futureCards = flashcardRepository.findByUserIdAndProximaRevisaoBetween(user.getId(), today, targetEndDate);
        for (Flashcard f : futureCards) {
            originalCounts.merge(f.getProximaRevisao(), 1, Integer::sum);
        }
        originalCounts.merge(today, totalCards, Integer::sum);

        for (LocalDate date : draftMap.values()) {
            draftCounts.merge(date, 1, Integer::sum);
        }

        List<DailyLoadDto> dailyLoads = new ArrayList<>();
        for (int dayOffset = 0; dayOffset < daysToSpread; dayOffset++) {
            LocalDate currentDate = today.plusDays(dayOffset);
            int original = originalCounts.getOrDefault(currentDate, 0);
            int newC = (currentDate.equals(today) ? (original - totalCards) : original) + draftCounts.getOrDefault(currentDate, 0);
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
                    .totalFlashcardsRedistributed(totalCards)
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

            List<Flashcard> cardsToUpdate = flashcardRepository.findAllById(draftMap.keySet());
            Map<String, LocalDate> earliestDateByTema = new HashMap<>();

            for (Flashcard card : cardsToUpdate) {
                if (card.getUser().getId().equals(user.getId())) {
                    LocalDate newDate = draftMap.get(card.getId());
                    if (newDate != null) {
                        card.setProximaRevisao(newDate);
                        
                        if (card.getTema() != null) {
                            earliestDateByTema.compute(card.getTema(), (k, v) -> (v == null || newDate.isBefore(v)) ? newDate : v);
                        }
                    }
                }
            }
            flashcardRepository.saveAll(cardsToUpdate);
            draftRepository.delete(draft);
            
            // Also update the delayed StudySessions for the rearranged temas
            if (!earliestDateByTema.isEmpty()) {
                List<StudySession> overdueSessions = studySessionRepository.findByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(user.getId(), LocalDate.now());
                List<StudySession> sessionsToUpdate = new ArrayList<>();
                for (StudySession session : overdueSessions) {
                    if (session.getTema() != null && earliestDateByTema.containsKey(session.getTema())) {
                        session.setDataProximaRevisao(earliestDateByTema.get(session.getTema()));
                        sessionsToUpdate.add(session);
                    }
                }
                studySessionRepository.saveAll(sessionsToUpdate);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error applying draft", e);
        }
    }

    private Lesson getLessonForFlashcard(Flashcard flashcard, Map<String, Lesson> cache, User user) {
        if (flashcard.getTema() == null) {
            return null;
        }
        return cache.computeIfAbsent(flashcard.getTema(), tema -> 
                lessonRepository.findByUserAndTema(user, tema).orElse(null)
        );
    }

    private int getPriorityOrder(Flashcard flashcard, Map<String, Lesson> cache, User user) {
        Lesson lesson = getLessonForFlashcard(flashcard, cache, user);
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

    private int getPercentAcerto(Flashcard flashcard, Map<String, Lesson> cache, User user) {
        Lesson lesson = getLessonForFlashcard(flashcard, cache, user);
        if (lesson == null || lesson.getPercentAcerto() == null) {
            return 100;
        }
        return lesson.getPercentAcerto();
    }
}
