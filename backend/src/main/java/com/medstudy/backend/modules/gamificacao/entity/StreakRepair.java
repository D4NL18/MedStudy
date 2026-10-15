package com.medstudy.backend.modules.gamificacao.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "streak_repairs", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_repaired_date", columnNames = {"user_id", "repaired_date"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StreakRepair extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "repaired_date", nullable = false)
    private LocalDate repairedDate;
}
