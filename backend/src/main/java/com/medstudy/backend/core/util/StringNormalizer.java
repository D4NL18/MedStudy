package com.medstudy.backend.core.util;

import java.text.Normalizer;
import java.util.regex.Pattern;
import java.util.Arrays;
import java.util.stream.Collectors;

public class StringNormalizer {

    private static final Pattern DIACRITICS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    /**
     * Normaliza uma string: remove acentos, trim, e aplica Title Case.
     * Ex: "  obstetrícia  " -> "Obstetricia"
     * Ex: "CLÍNICA MÉDICA" -> "Clinica Medica"
     */
    public static String normalize(String input) {
        if (input == null || input.isBlank()) {
            return null;
        }

        // 1. Decompor Unicode e remover marcas de acentuação
        String decomposed = Normalizer.normalize(input, Normalizer.Form.NFD);
        String withoutAccents = DIACRITICS.matcher(decomposed).replaceAll("");

        // 2. Trim e Title Case
        return Arrays.stream(withoutAccents.trim().split("\\s+"))
                .filter(word -> !word.isEmpty())
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }

    /**
     * Versão para comparação interna (Case Insensitive, s/ acentos)
     */
    public static String canonical(String input) {
        String normalized = normalize(input);
        return normalized != null ? normalized.toLowerCase() : null;
    }
}
