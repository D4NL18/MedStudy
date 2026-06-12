package com.medstudy.backend.core.export.controller;

import com.medstudy.backend.core.export.dto.PdfExportRequest;
import com.medstudy.backend.core.export.service.CsvExportService;
import com.medstudy.backend.core.export.service.PdfExportService;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.service.StudySessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller responsible for handling data export requests (PDF, CSV).
 */
@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@Tag(name = "Export", description = "Endpoints for exporting data to PDF and CSV")
public class ExportController {

    private final PdfExportService pdfExportService;
    private final CsvExportService csvExportService;
    private final StudySessionService studySessionService;
    private final com.medstudy.backend.modules.dashboard.service.DashboardService dashboardService;

    /**
     * Exports dashboard data and charts to a PDF file.
     *
     * @param request The request containing the title and charts base64 strings
     * @return The generated PDF file as a byte array
     */
    @Operation(summary = "Export to PDF", description = "Generates a PDF report containing performance metrics and charts.")
    @ApiResponse(responseCode = "200", description = "PDF successfully generated")
    @PostMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf(@RequestBody PdfExportRequest request) {
        Map<String, Object> data = new HashMap<>();
        data.put("title", request.getTitle());
        data.put("charts", request.getCharts());
        
        com.medstudy.backend.modules.dashboard.dto.DashboardResponse dashboardData = dashboardService.getDashboardData();
        data.put("kpis", dashboardData);
        data.put("areas", dashboardData.getAreaAnalytics());
        data.put("topErrors", dashboardData.getTopErrors());

        byte[] pdf = pdfExportService.generatePdf("performance-report", data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-medstudy.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    /**
     * Exports study sessions to a CSV file.
     *
     * @param grandeArea Optional filter by Grande Área
     * @param tema Optional filter by Tema
     * @param instituicao Optional filter by Instituição
     * @param revisaoConcluida Optional filter by revision status
     * @param minRate Optional filter by minimum performance rate
     * @param maxRate Optional filter by maximum performance rate
     * @param response The HTTP response used to stream the CSV file
     * @throws IOException If an input or output exception occurs
     */
    @Operation(summary = "Export to CSV", description = "Generates a CSV file containing the user's study sessions with optional filters.")
    @ApiResponse(responseCode = "200", description = "CSV successfully generated")
    @GetMapping("/csv")
    public void exportCsv(
            @RequestParam(required = false) String grandeArea,
            @RequestParam(required = false) String tema,
            @RequestParam(required = false) String instituicao,
            @RequestParam(required = false) Boolean revisaoConcluida,
            @RequestParam(required = false) Double minRate,
            @RequestParam(required = false) Double maxRate,
            HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sessoes-estudo.csv");

        List<StudySessionResponse> sessions = studySessionService.findAll(
                grandeArea, tema, instituicao, revisaoConcluida, minRate, maxRate, Pageable.ofSize(2000)
        ).getContent();

        String[] headers = {"Data", "Grande Área", "Tema", "Feitas", "Corretas", "%", "Instituição", "Obs"};
        List<String[]> data = sessions.stream()
                .map(s -> new String[]{
                        s.getDataSessao().toString(),
                        s.getGrandeArea(),
                        s.getTema(),
                        String.valueOf(s.getQtsFeitas()),
                        String.valueOf(s.getQtsCorretas()),
                        String.format("%.2f", s.getQtsFeitas() > 0 ? (double) s.getQtsCorretas() / s.getQtsFeitas() * 100 : 0),
                        s.getInstituicao(),
                        s.getObservacoes()
                })
                .collect(Collectors.toList());

        csvExportService.writeCsv(response.getWriter(), headers, data);
    }
}

