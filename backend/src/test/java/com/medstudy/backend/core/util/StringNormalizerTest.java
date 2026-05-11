package com.medstudy.backend.core.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StringNormalizerTest {

    @Test
    void testNormalize() {
        assertEquals("Pediatria", StringNormalizer.normalize("  pediatria  "));
        assertEquals("Obstetricia", StringNormalizer.normalize("Obstetrícia"));
        assertEquals("Clinica Medica", StringNormalizer.normalize("CLÍNICA médica"));
        assertEquals("Ginecologia E Obstetricia", StringNormalizer.normalize("ginecologia e obstetrícia"));
    }

    @Test
    void testNormalizeWithNull() {
        assertNull(StringNormalizer.normalize(null));
        assertNull(StringNormalizer.normalize("   "));
    }
}
