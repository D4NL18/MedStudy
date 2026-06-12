package com.medstudy.backend.core.export.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.util.Map;

/**
 * Service for generating PDF documents from HTML templates.
 */
@Service
public class PdfExportService {

    private final TemplateEngine templateEngine;

    /**
     * Constructs a new PdfExportService with the required template engine.
     *
     * @param templateEngine The Thymeleaf template engine used to process HTML templates
     */
    public PdfExportService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    /**
     * Generates a PDF file based on a given template name and dynamic data.
     *
     * @param templateName The name of the Thymeleaf template (located in the exports/ directory)
     * @param data         The variables to inject into the template
     * @return A byte array representing the generated PDF document
     * @throws RuntimeException if an error occurs during PDF generation
     */
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
