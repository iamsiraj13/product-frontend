export interface TodayTaskProgress {
  totalGeneratedToday: number;
  completedToday: number;
  dailyLimit: number;
  remainingToday: number;
}

export interface CommissionSummary {
  totalEarned: number;
  todayEarned: number;
}

export interface InvitedBy {
  id: string;
  username: string;
}

export interface ProfileData {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  accountType: string;
  balance: string;
  invitationCode: string;
  parentUserId: string | null;
  parentUser: unknown | null;
  childAccounts: unknown[];
  invitedBy: InvitedBy | null;
  _count: {
    invitees: number;
  };
  createdAt: string;
  todayTaskProgress: TodayTaskProgress;
  commissionSummary: CommissionSummary;
}
