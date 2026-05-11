package com.medstudy.backend.modules.analytics.controller;

import com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicErrorResponse;
import com.medstudy.backend.modules.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Análise detalhada por Área e Tema")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/areas")
    public ResponseEntity<List<AreaAnalyticsResponse>> getAreaAnalytics(
            @RequestParam(required = false, defaultValue = "TOTAL") String period) {
        return ResponseEntity.ok(service.getAreaAnalytics(period));
    }

    @GetMapping("/topics")
    public ResponseEntity<List<TopicAnalyticsResponse>> getTopicAnalytics(
            @RequestParam(required = false, defaultValue = "TOTAL") String period) {
        return ResponseEntity.ok(service.getTopicAnalytics(period));
    }

    @GetMapping("/errors")
    public ResponseEntity<List<TopicErrorResponse>> getTopErrorThemes(
            @RequestParam(required = false, defaultValue = "LAST_60_DAYS") String period) {
        return ResponseEntity.ok(service.getTopErrorThemes(period));
    }
}
