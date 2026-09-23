import { apiClient } from './api-client';
import {
  GetAdminWithdrawalsParams,
  AdminWithdrawalsApiResponse,
  UpdateWithdrawalStatusPayload,
} from '@/types/adminWithdrawal';

export const adminWithdrawalsApi = {
  getWithdrawals: async (
    params?: GetAdminWithdrawalsParams
  ): Promise<AdminWithdrawalsApiResponse> => {
    const response = await apiClient.get<AdminWithdrawalsApiResponse>('/admin/withdrawals', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...(params?.status ? { status: params.status } : {}),
      },
    });
    return response.data;
  },

  updateStatus: async (
    id: string,
    payload: UpdateWithdrawalStatusPayload
  ): Promise<AdminWithdrawalsApiResponse> => {
    const response = await apiClient.patch<AdminWithdrawalsApiResponse>(
      `/admin/withdrawals/${id}/status`,
      payload
    );
    return response.data;
  },
};
