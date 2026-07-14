package com.medstudy.backend.modules.flashcard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyLoadDto {
    private LocalDate date;
    private int originalCount;
    private int newCount;
}
