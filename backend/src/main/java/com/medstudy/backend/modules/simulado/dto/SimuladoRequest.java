package com.medstudy.backend.modules.simulado.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record SimuladoRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,

        @NotNull(message = "Data de realização é obrigatória") LocalDate dataRealizacao,

        Integer cmTotal, Integer cmAcertos, Integer cmErros,
        Integer cirTotal, Integer cirAcertos, Integer cirErros,
        Integer pedTotal, Integer pedAcertos, Integer pedErros,
        Integer goTotal, Integer goAcertos, Integer goErros,
        Integer prevTotal, Integer prevAcertos, Integer prevErros) {
}
