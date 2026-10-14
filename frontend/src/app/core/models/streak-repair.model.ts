export interface StreakStatusResponse {
  currentStreak: number;
  streakAtRisk: boolean;
  canRepair: boolean;
  repairDeadline: string | null;
  requiredCardsCount: number;
  currentRepairedCount: number;
  lastRepairedAt: string | null;
}

export interface StreakRepairResponse {
  success: boolean;
  newStreak: number;
  message: string;
}
