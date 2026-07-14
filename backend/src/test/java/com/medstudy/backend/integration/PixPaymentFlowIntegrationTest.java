package com.medstudy.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.dto.PixResponseDto;
import com.medstudy.backend.modules.subscription.dto.PixStatusResponseDto;
import com.medstudy.backend.modules.subscription.entity.PixTransaction;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.PixTransactionRepository;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"test", "mock-pix"})
@Transactional
class PixPaymentFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @Autowired
    private PixTransactionRepository pixTransactionRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User user;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setName("Pix Integration User");
        user.setEmail("pixuser_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com");
        user.setPassword(passwordEncoder.encode("Password123!"));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStatus(SubscriptionStatus.TRIAL);
        subscription.setTrialStartDate(Instant.now());
        subscription.setTrialEndDate(Instant.now().plus(30, ChronoUnit.DAYS));
        subscriptionRepository.save(subscription);

        this.jwtToken = jwtService.generateToken(user);
    }

    @Test
    @DisplayName("Geração de cobrança PIX deve retornar txid, QR Code e chave Copia e Cola")
    void createPixCharge_ShouldReturnQrCodeAndCopiaECola() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/subscriptions/pix/create")
                .header("Authorization", "Bearer " + jwtToken))
            .andExpect(status().isCreated())
            .andReturn();

        PixResponseDto response = objectMapper.readValue(result.getResponse().getContentAsString(), PixResponseDto.class);

        assertNotNull(response.txid());
        assertTrue(response.txid().startsWith("MEDSTUDY"));
        assertNotNull(response.pixCopiaECola());
        assertEquals(PixStatus.CREATED, response.status());

        Optional<PixTransaction> txOpt = pixTransactionRepository.findByTxid(response.txid());
        assertTrue(txOpt.isPresent());
        assertEquals(PixStatus.CREATED, txOpt.get().getStatus());
    }

    @Test
    @DisplayName("Simulação de pagamento no profile mock-pix deve ativar a assinatura com +365 dias acumulados")
    void simulatePayment_ShouldActivateSubscriptionAndAllowAccess() throws Exception {
        // 1. Criar PIX
        MvcResult createResult = mockMvc.perform(post("/api/subscriptions/pix/create")
                .header("Authorization", "Bearer " + jwtToken))
            .andExpect(status().isCreated())
            .andReturn();

        PixResponseDto pixDto = objectMapper.readValue(createResult.getResponse().getContentAsString(), PixResponseDto.class);

        // 2. Simular Pagamento via Dev Controller
        MvcResult simResult = mockMvc.perform(post("/api/subscriptions/dev/simulate-pix-paid/" + pixDto.txid()))
            .andExpect(status().isOk())
            .andReturn();

        PixStatusResponseDto statusDto = objectMapper.readValue(simResult.getResponse().getContentAsString(), PixStatusResponseDto.class);
        assertEquals(PixStatus.PAID, statusDto.status());

        // 3. Verificar Assinatura no Banco (Status = ACTIVE e validade estendida)
        Subscription subscription = subscriptionRepository.findByUserId(user.getId()).orElseThrow();
        assertEquals(SubscriptionStatus.ACTIVE, subscription.getStatus());
        assertNotNull(subscription.getCurrentPeriodEnd());
        assertTrue(subscription.getCurrentPeriodEnd().isAfter(Instant.now().plus(360, ChronoUnit.DAYS)));

        // 4. Acessar rota protegida e verificar retorno HTTP 200 OK (Paywall liberto)
        mockMvc.perform(get("/api/user-settings")
                .header("Authorization", "Bearer " + jwtToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Verificação via endpoint 'Já Paguei' deve retornar o status da transação")
    void checkPaymentStatus_JaPaguei_ShouldReturnStatus() throws Exception {
        // 1. Criar PIX
        MvcResult createResult = mockMvc.perform(post("/api/subscriptions/pix/create")
                .header("Authorization", "Bearer " + jwtToken))
            .andExpect(status().isCreated())
            .andReturn();

        PixResponseDto pixDto = objectMapper.readValue(createResult.getResponse().getContentAsString(), PixResponseDto.class);

        // 2. Checar status via GET
        MvcResult statusResult = mockMvc.perform(get("/api/subscriptions/pix/" + pixDto.txid() + "/status")
                .header("Authorization", "Bearer " + jwtToken))
            .andExpect(status().isOk())
            .andReturn();

        PixStatusResponseDto statusDto = objectMapper.readValue(statusResult.getResponse().getContentAsString(), PixStatusResponseDto.class);
        assertEquals(PixStatus.CREATED, statusDto.status());
    }
}
