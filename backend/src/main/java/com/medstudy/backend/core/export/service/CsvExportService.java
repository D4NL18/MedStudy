package com.medstudy.backend.core.export.service;

import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

import java.io.Writer;
import java.util.List;

/**
 * Service for exporting data to CSV format.
 */
@Service
public class CsvExportService {

    /**
     * Writes headers and data rows to the provided writer in CSV format.
     *
     * @param writer  The writer to output the CSV data
     * @param headers An array of strings representing the CSV headers
     * @param data    A list of string arrays representing the CSV rows
     * @throws RuntimeException if an error occurs while writing the CSV
     */
    public void writeCsv(Writer writer, String[] headers, List<String[]> data) {
        try (CSVWriter csvWriter = new CSVWriter(writer)) {
            csvWriter.writeNext(headers);
            csvWriter.writeAll(data);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar CSV", e);
        }
    }
}
