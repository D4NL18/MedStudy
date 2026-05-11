package com.medstudy.backend.modules.simulado.specification;

import org.junit.jupiter.api.Test;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class SimuladoSpecificationsTest {

    @Test
    void specifications_ShouldReturnNotNull() {
        assertNotNull(SimuladoSpecifications.hasUserId(UUID.randomUUID()));
        assertNotNull(SimuladoSpecifications.hasNome("Simulado"));
        assertNotNull(SimuladoSpecifications.hasInstituicao("USP"));
    }

    @Test
    void specifications_WithNull_ShouldReturnNull() {
        assertNull(SimuladoSpecifications.hasNome(null).toPredicate(null, null, null));
        assertNull(SimuladoSpecifications.hasNome("").toPredicate(null, null, null));
        assertNull(SimuladoSpecifications.hasInstituicao(null).toPredicate(null, null, null));
        assertNull(SimuladoSpecifications.hasInstituicao("").toPredicate(null, null, null));
    }
}
