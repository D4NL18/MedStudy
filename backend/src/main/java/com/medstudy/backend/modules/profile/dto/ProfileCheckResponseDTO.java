package com.medstudy.backend.modules.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileCheckResponseDTO {
    private String handle;
    private boolean disponivel;
}
