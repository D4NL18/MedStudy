package com.medstudy.backend.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequest(
        @NotBlank(message = "Nome é obrigatório") String name,

        @NotBlank(message = "Email é obrigatório") @Email(message = "Email inválido") String email,

        @NotBlank(message = "Senha é obrigatória")
        @org.hibernate.validator.constraints.Length(min = 8, message = "A senha deve ter pelo menos 8 caracteres")
        @jakarta.validation.constraints.Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
        )
        String password,

        @NotBlank(message = "Role é obrigatória") String role) {
}
