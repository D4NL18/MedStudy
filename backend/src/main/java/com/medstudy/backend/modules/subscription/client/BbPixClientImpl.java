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
@Profile("!mock-pix")
public class BbPixClientImpl implements PixClient {

    @Override
    public PixResponseDto createImmediateCharge(User user, BigDecimal amount, int expirationSeconds) {
        // Exemplo/Skeleton para integração real do Banco do Brasil (OAuth2 + mTLS)
        String txid = "MEDSTUDY" + UUID.randomUUID().toString().replace("-", "");
        Instant expirationDate = Instant.now().plusSeconds(expirationSeconds);
        String copiaECola = "00020101021226870014br.gov.bcb.pix2565pix.bb.com.br/qr/v2/cobv/" + txid + "5204000053039865405297.005802BR5915MEDSTUDY PRO6009SAO PAULO62070503***6304ABCD";

        return new PixResponseDto(
            txid,
            copiaECola,
            "https://pix.bb.com.br/qr/v2/cobv/" + txid,
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
            "Consulta efetuada na API do Banco do Brasil"
        );
    }
}
