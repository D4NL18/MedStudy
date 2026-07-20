/**
 * TypeScript model/interface for Profile.
 * @description Defines the data shape used by the application for Profile entities.
 */
export interface Profile {
  id?: string;
  userId?: string;
  handle: string;
  nomeCompleto: string;
  isFormado?: boolean;
  semestre?: number | null;
  faculdade: string;
  avatarPresetId: string;
  profilePictureUrl?: string;

  // Privacy Settings
  isPublic?: boolean;
  shareStreak?: boolean;
  shareFaculdade?: boolean;
  shareTotalQuestions?: boolean;
  shareBadges?: boolean;

  // Metadata context & statistics
  streak?: number | null;
  totalQuestions?: number | null;
  badges?: string[];
  isPrivate?: boolean;
  friendshipStatus?: string;
  isRequester?: boolean;
}

export interface ProfileCheckResponse {
  handle: string;
  disponivel: boolean;
}
