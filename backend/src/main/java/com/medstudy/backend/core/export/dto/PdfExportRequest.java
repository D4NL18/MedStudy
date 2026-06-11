package com.medstudy.backend.core.export.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * Data Transfer Object representing a request to export data to PDF.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PdfExportRequest {

    /**
     * The title of the exported document.
     */
    @Schema(description = "The title to be printed at the top of the exported PDF document.", example = "My Performance Report")
    private String title;

    /**
     * A map of charts to be included in the PDF, where the key is the chart name or ID,
     * and the value is a Base64 encoded string of the chart image.
     */
    @Schema(description = "A map containing chart identifiers (e.g., 'accuracyChart') and their corresponding Base64 encoded image strings to be embedded in the PDF.", example = "{\"accuracyChart\": \"iVBORw0KGgoAAAANSUhEUgAA...\"}")
    private Map<String, String> charts; 
}
