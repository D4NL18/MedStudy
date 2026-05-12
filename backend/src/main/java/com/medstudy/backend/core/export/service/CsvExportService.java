package com.medstudy.backend.core.export.service;

import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

import java.io.Writer;
import java.util.List;

@Service
public class CsvExportService {

    public void writeCsv(Writer writer, String[] headers, List<String[]> data) {
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            csvWriter.writeNext(headers);
            csvWriter.writeAll(data);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar CSV", e);
        }
    }
}
