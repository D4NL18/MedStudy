package com.medstudy.backend.modules.subscription.client;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.dto.PixResponseDto;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class MockPixClientTest {

    private final MockPixClientImpl mockPixClient = new MockPixClientImpl();

    @Test
    @DisplayName("Devem ser gerados dados válidos de PIX no ambiente mock")
    void createImmediateCharge_ShouldReturnValidMockData() {
        User user = new User();
        user.setEmail("test@medstudy.com");

        PixResponseDto response = mockPixClient.createImmediateCharge(user, new BigDecimal("297.00"), 900);

        assertNotNull(response);
        assertTrue(response.txid().startsWith("MEDSTUDY"));
        assertNotNull(response.pixCopiaECola());
        assertEquals(PixStatus.CREATED, response.status());
        assertEquals(new BigDecimal("297.00"), response.amount());
    }
}
