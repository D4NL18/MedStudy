package com.medstudy.backend.modules.notificacao.service;

import com.medstudy.backend.modules.aula.repository.LessonRepository;
import com.medstudy.backend.modules.notificacao.dto.NotificationSummaryResponse;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class NotificationService {

    private final StudySessionRepository studySessionRepository;
    private final LessonRepository lessonRepository;

    public NotificationService(StudySessionRepository studySessionRepository, LessonRepository lessonRepository) {
        this.studySessionRepository = studySessionRepository;
        this.lessonRepository = lessonRepository;
    }

    public NotificationSummaryResponse getSummary() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();

        long pendingRevisions = studySessionRepository.countPendingRevisions(userId, today);
        long reinforcementLessons = lessonRepository.countByUserIdAndReforcoTrue(userId);

        return new NotificationSummaryResponse(
            pendingRevisions,
            reinforcementLessons,
            pendingRevisions + reinforcementLessons
        );
    }
}
