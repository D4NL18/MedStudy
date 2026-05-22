export enum CompetitionType {
  GROUP = 'GROUP',
  DUEL_TIME = 'DUEL_TIME',
  DUEL_TARGET = 'DUEL_TARGET'
}

export enum MetricType {
  TOTAL_QUESTIONS = 'TOTAL_QUESTIONS',
  CORRECT_QUESTIONS = 'CORRECT_QUESTIONS'
}

export enum CompetitionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

export enum ParticipantStatus {
  INVITED = 'INVITED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED'
}

export interface ParticipantInfo {
  userId: string;
  name: string;
  handle: string;
  avatarPresetId?: string;
  status: ParticipantStatus;
  joinedAt?: string;
}

export interface Competition {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  competitionType: CompetitionType;
  metricType: MetricType;
  targetValue?: number;
  startDate: string;
  endDate: string;
  status: CompetitionStatus;
  participants: ParticipantInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  handle: string;
  avatarPresetId?: string;
  score: number;
  position: number;
}

export interface CompetitionRequest {
  title: string;
  competitionType: CompetitionType;
  metricType: MetricType;
  targetValue?: number;
  startDate: string;
  endDate: string;
  invitedFriendIds: string[];
}
