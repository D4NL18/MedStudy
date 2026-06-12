package com.medstudy.backend.modules.gamificacao.scheduler;

import com.medstudy.backend.modules.gamificacao.entity.BadgeType;
import com.medstudy.backend.modules.gamificacao.enums.BadgeContext;
import com.medstudy.backend.modules.gamificacao.service.BadgeService;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service responsible for scheduling badge evaluation tasks.
 */
@Service
public class BadgeSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(BadgeSchedulerService.class);

    private final UserRepository userRepository;
    private final BadgeService badgeService;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Constructs a new BadgeSchedulerService.
     *
     * @param userRepository the user repository
     * @param badgeService   the badge service
     * @param eventPublisher the application event publisher
     */
    public BadgeSchedulerService(UserRepository userRepository, 
                                 BadgeService badgeService,
                                 ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.badgeService = badgeService;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Periodically evaluates all users to award missing or retroactive badges.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void evaluateRetroactiveBadges() {
        log.info("Iniciando rotina diária de verificação de conquistas retroativas...");
        
        List<User> users = userRepository.findAll();
        int countUsers = 0;
        int countBadges = 0;

        for (User user : users) {
            List<BadgeType> newlyEarned = badgeService.checkAndAwardBadges(user.getId(), BadgeContext.GENERAL);
            if (!newlyEarned.isEmpty()) {
                countUsers++;
                countBadges += newlyEarned.size();
                
                for (BadgeType badge : newlyEarned) {
                    eventPublisher.publishEvent(new com.medstudy.backend.modules.feed.events.FeedEventListener.BadgeEarnedEvent(
                        user.getId().getMostSignificantBits() & Long.MAX_VALUE,
                        badge.name(),
                        badge.getDisplayName(),
                        badge.getDescription()
                    ));
                }
            }
        }

        log.info("Rotina de conquistas retroativas finalizada. {} novas medalhas concedidas para {} usuários.", countBadges, countUsers);
    }
}
