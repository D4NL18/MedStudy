export interface Profile {
  id?: string;
  userId?: string;
  handle: string;
  nomeCompleto: string;
  isFormado?: boolean;
  semestre?: number | null;
  faculdade: string;
  avatarPresetId: string;
}

export interface ProfileCheckResponse {
  handle: string;
  disponivel: boolean;
}
