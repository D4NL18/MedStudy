package com.medstudy.backend.core.export.controller;

import com.medstudy.backend.core.export.dto.PdfExportRequest;
import com.medstudy.backend.core.export.service.CsvExportService;
import com.medstudy.backend.core.export.service.PdfExportService;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.service.StudySessionService;
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

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@Tag(name = "Exportação", description = "Endpoints para exportação de dados em PDF e CSV")
public class ExportController {

    private final PdfExportService pdfExportService;
    private final CsvExportService csvExportService;
    private final StudySessionService studySessionService;

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf(@RequestBody PdfExportRequest request) {
        Map<String, Object> data = new HashMap<>();
        data.put("title", request.title());
        data.put("charts", request.charts());
        
        // Add metrics summary
        data.put("metrics", studySessionService.getMetrics());

        byte[] pdf = pdfExportService.generatePdf("performance-report", data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-medstudy.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

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

        // Use a large page size or a dedicated "findAll" without paging if volume is huge
        // For v1.1, 1000 items is a safe assumption for a single user's history
        List<StudySessionResponse> sessions = studySessionService.findAll(
                grandeArea, tema, instituicao, revisaoConcluida, minRate, maxRate, Pageable.ofSize(2000)
        ).getContent();

        String[] headers = {"Data", "Grande Área", "Tema", "Feitas", "Corretas", "%", "Instituição", "Obs"};
        List<String[]> data = sessions.stream()
                .map(s -> new String[]{
                        s.dataSessao().toString(),
                        s.grandeArea(),
                        s.tema(),
                        String.valueOf(s.qtsFeitas()),
                        String.valueOf(s.qtsCorretas()),
                        String.format("%.2f", s.qtsFeitas() > 0 ? (double) s.qtsCorretas() / s.qtsFeitas() * 100 : 0),
                        s.instituicao(),
                        s.observacoes()
                })
                .collect(Collectors.toList());

        csvExportService.writeCsv(response.getWriter(), headers, data);
    }
}
