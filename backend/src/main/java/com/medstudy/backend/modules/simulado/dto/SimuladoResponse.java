package com.medstudy.backend.modules.simulado.dto;

import java.time.LocalDate;
import java.util.UUID;

public record SimuladoResponse(
    UUID id,
    String nome,
    LocalDate dataRealizacao,
    int cmTotal, int cmAcertos, int cmErros,
    int cirTotal, int cirAcertos, int cirErros,
    int pedTotal, int pedAcertos, int pedErros,
    int goTotal, int goAcertos, int goErros,
    int prevTotal, int prevAcertos, int prevErros
) {}
