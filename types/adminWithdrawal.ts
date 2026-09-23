export interface AdminWithdrawalUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
}

export interface AdminWithdrawalItem {
  id: string;
  userId: string;
  network: string;
  walletAddress: string;
  amount: string | number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  rejectionReason?: string | null;
  processedAt?: string | null;
  processedById?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: AdminWithdrawalUser;
}

export interface AdminWithdrawalsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAdminWithdrawalsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export type WithdrawalStatus = 'APPROVED' | 'REJECTED';

export interface UpdateWithdrawalStatusPayload {
  status: WithdrawalStatus;
  rejectionReason?: string;
}

export interface AdminWithdrawalsResponseData {
  data: AdminWithdrawalItem[];
  meta: AdminWithdrawalsMeta;
}

export interface AdminWithdrawalsApiResponse {
  success: boolean;
  statusCode?: number;
  data?: AdminWithdrawalsResponseData | AdminWithdrawalItem[];
  meta?: AdminWithdrawalsMeta;
  message?: string;
  timestamp?: string;
}
