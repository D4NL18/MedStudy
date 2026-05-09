package com.medstudy.backend.modules.aula.repository;

import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID>, JpaSpecificationExecutor<Lesson> {
    java.util.List<Lesson> findByUserIdAndTemaContainingIgnoreCase(UUID userId, String tema);
    Optional<Lesson> findByUserAndTema(User user, String tema);
}
