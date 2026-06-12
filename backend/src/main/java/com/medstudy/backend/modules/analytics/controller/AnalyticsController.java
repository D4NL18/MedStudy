package com.medstudy.backend.modules.analytics.controller;

import com.medstudy.backend.modules.analytics.dto.AreaAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicAnalyticsResponse;
import com.medstudy.backend.modules.analytics.dto.TopicErrorResponse;
import com.medstudy.backend.modules.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for handling analytics related requests.
 */
@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Detailed analytics by Area and Theme")
public class AnalyticsController {

    private final AnalyticsService service;

    /**
     * Constructs a new AnalyticsController with the given service.
     *
     * @param service The analytics service.
     */
    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    /**
     * Retrieves area analytics for a specific period.
     *
     * @param period The period for the analytics.
     * @return A list of area analytics responses.
     */
    @Operation(summary = "Get Area Analytics", description = "Retrieves analytics data aggregated by area for the specified period.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved area analytics")
    @GetMapping("/areas")
    public ResponseEntity<List<AreaAnalyticsResponse>> getAreaAnalytics(
            @RequestParam(required = false, defaultValue = "TOTAL") String period) {
        return ResponseEntity.ok(service.getAreaAnalytics(period));
    }

    /**
     * Retrieves topic analytics for a specific period.
     *
     * @param period The period for the analytics.
     * @return A list of topic analytics responses.
     */
    @Operation(summary = "Get Topic Analytics", description = "Retrieves analytics data aggregated by topic for the specified period.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved topic analytics")
    @GetMapping("/topics")
    public ResponseEntity<List<TopicAnalyticsResponse>> getTopicAnalytics(
            @RequestParam(required = false, defaultValue = "TOTAL") String period) {
        return ResponseEntity.ok(service.getTopicAnalytics(period));
    }

    /**
     * Retrieves the top error themes for a specific period.
     *
     * @param period The period for the analytics.
     * @return A list of top error themes responses.
     */
    @Operation(summary = "Get Top Error Themes", description = "Retrieves the top topics with the highest error rates for the specified period.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved top error themes")
    @GetMapping("/errors")
    public ResponseEntity<List<TopicErrorResponse>> getTopErrorThemes(
            @RequestParam(required = false, defaultValue = "LAST_60_DAYS") String period) {
        return ResponseEntity.ok(service.getTopErrorThemes(period));
    }
}
