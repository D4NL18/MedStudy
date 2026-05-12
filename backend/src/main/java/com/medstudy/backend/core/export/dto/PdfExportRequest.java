package com.medstudy.backend.core.export.dto;

import java.util.Map;

public record PdfExportRequest(
    String title,
    Map<String, String> charts // Key: Chart name/ID, Value: Base64 string
) {}
