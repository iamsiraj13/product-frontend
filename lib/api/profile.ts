import { apiClient } from './api-client';
import { ApiResponse } from '@/types/auth';
import { ProfileData, ChangePasswordPayload, ChangeWithdrawalPasswordPayload } from '@/types/profile';

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<ProfileData>> => {
    const response = await apiClient.get<ApiResponse<ProfileData>>('/profile');
    return response.data;
  },
  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/profile/change-password', payload);
    return response.data;
  },
  changeWithdrawalPassword: async (payload: ChangeWithdrawalPasswordPayload): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/profile/change-withdrawal-password', payload);
    return response.data;
  },
};


