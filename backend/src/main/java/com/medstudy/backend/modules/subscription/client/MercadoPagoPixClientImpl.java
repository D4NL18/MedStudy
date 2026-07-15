package com.medstudy.backend.modules.subscription.client;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.dto.PixResponseDto;
import com.medstudy.backend.modules.subscription.dto.PixStatusResponseDto;
import com.medstudy.backend.modules.user.entity.User;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Component
@Primary
@Profile("!mock-pix")
public class MercadoPagoPixClientImpl implements PixClient {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    @Override
    public PixResponseDto createImmediateCharge(User user, BigDecimal amount, int expirationSeconds) {
        PaymentClient client = new PaymentClient();

        OffsetDateTime expirationDate = OffsetDateTime.now(ZoneOffset.UTC).plusSeconds(expirationSeconds);

        PaymentCreateRequest createRequest = PaymentCreateRequest.builder()
                .transactionAmount(amount)
                .paymentMethodId("pix")
                .payer(PaymentPayerRequest.builder()
                        .email(user.getEmail())
                        .firstName(user.getName())
                        .build())
                .dateOfExpiration(expirationDate)
                .description("MedStudy Premium - Assinatura Anual")
                .build();

        try {
            Payment payment = client.create(createRequest);
            
            String txid = payment.getId().toString();
            String copiaECola = payment.getPointOfInteraction().getTransactionData().getQrCode();
            String qrCodeBase64 = payment.getPointOfInteraction().getTransactionData().getQrCodeBase64();
            String qrCodeLocation = payment.getPointOfInteraction().getTransactionData().getTicketUrl();
            
            return new PixResponseDto(
                txid,
                copiaECola,
                qrCodeLocation,
                qrCodeBase64,
                amount,
                expirationDate.toInstant(),
                PixStatus.CREATED
            );
        } catch (MPException | MPApiException e) {
            throw new RuntimeException("Erro ao criar pagamento via PIX no Mercado Pago", e);
        }
    }

    @Override
    public PixStatusResponseDto getChargeStatus(String txid) {
        PaymentClient client = new PaymentClient();
        try {
            Payment payment = client.get(Long.parseLong(txid));
            PixStatus status = mapStatus(payment.getStatus());
            
            return new PixStatusResponseDto(
                txid,
                status,
                payment.getDateApproved() != null ? payment.getDateApproved().toInstant() : null,
                "Consulta via API do Mercado Pago"
            );
        } catch (MPException | MPApiException | NumberFormatException e) {
            throw new RuntimeException("Erro ao consultar pagamento via PIX no Mercado Pago", e);
        }
    }
    
    private PixStatus mapStatus(String mpStatus) {
        if (mpStatus == null) return PixStatus.CREATED;
        
        switch (mpStatus) {
            case "approved":
                return PixStatus.PAID;
            case "cancelled":
            case "rejected":
                return PixStatus.EXPIRED;
            case "pending":
            case "in_process":
            default:
                return PixStatus.CREATED;
        }
    }
}
