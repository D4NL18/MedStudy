package com.medstudy.backend.modules.gamificacao.controller;

import com.medstudy.backend.modules.gamificacao.dto.UserBadgeResponse;
import com.medstudy.backend.modules.gamificacao.service.BadgeService;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import com.medstudy.backend.modules.gamificacao.entity.BadgeType;

@RestController
@RequestMapping("/api/badges")
public class UserBadgeController {

    private final BadgeService badgeService;

    public UserBadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    @GetMapping
    public List<UserBadgeResponse> getUserBadges() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return badgeService.getUserBadges(user.getId()).stream()
                .map(ub -> new UserBadgeResponse(
                        ub.getBadgeType(),
                        ub.getBadgeType().getDisplayName(),
                        ub.getBadgeType().getDescription(),
                        ub.getEarnedAt()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<BadgeType> getAllBadges() {
        return Arrays.asList(BadgeType.values());
    }
}
