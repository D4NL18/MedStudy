package com.medstudy.backend.core.export.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.util.Map;

@Service
public class PdfExportService {

    private final TemplateEngine templateEngine;

    public PdfExportService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generatePdf(String templateName, Map<String, Object> data) {
        Context context = new Context();
        context.setVariables(data);

        String htmlContent = templateEngine.process("exports/" + templateName, context);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            System.err.println(">>> PdfExportService Error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }
}
