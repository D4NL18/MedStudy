package com.medstudy.backend.modules.simulado.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record SimuladoRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,

        @NotNull(message = "Data de realização é obrigatória") LocalDate dataRealizacao,

        int cmTotal, int cmAcertos, int cmErros,
        int cirTotal, int cirAcertos, int cirErros,
        int pedTotal, int pedAcertos, int pedErros,
        int goTotal, int goAcertos, int goErros,
        int prevTotal, int prevAcertos, int prevErros) {
}
