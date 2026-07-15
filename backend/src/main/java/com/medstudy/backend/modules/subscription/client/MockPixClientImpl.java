package com.medstudy.backend.modules.subscription.client;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.dto.PixResponseDto;
import com.medstudy.backend.modules.subscription.dto.PixStatusResponseDto;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Component
@Profile("mock-pix")
public class MockPixClientImpl implements PixClient {

    @Override
    public PixResponseDto createImmediateCharge(User user, BigDecimal amount, int expirationSeconds) {
        String txid = "MEDSTUDY" + UUID.randomUUID().toString().replace("-", "");
        Instant expirationDate = Instant.now().plusSeconds(expirationSeconds);
        String copiaECola = "00020101021226870014br.gov.bcb.pix2565mock.medstudy.com.br/qr/v2/cobv/" + txid + "5204000053039865405297.005802BR5915MEDSTUDY MOCK6009SAO PAULO62070503***6304MOCK";

        return new PixResponseDto(
            txid,
            copiaECola,
            "https://mockpix.com/qr/" + txid,
            null,
            amount,
            expirationDate,
            PixStatus.CREATED
        );
    }

    @Override
    public PixStatusResponseDto getChargeStatus(String txid) {
        return new PixStatusResponseDto(
            txid,
            PixStatus.CREATED,
            null,
            "Status simulado via perfil mock-pix"
        );
    }
}
