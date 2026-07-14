package com.medstudy.backend.modules.subscription.client;

import com.medstudy.backend.modules.subscription.dto.PixResponseDto;
import com.medstudy.backend.modules.subscription.dto.PixStatusResponseDto;
import com.medstudy.backend.modules.user.entity.User;
import java.math.BigDecimal;

public interface PixClient {
    PixResponseDto createImmediateCharge(User user, BigDecimal amount, int expirationSeconds);
    PixStatusResponseDto getChargeStatus(String txid);
}
