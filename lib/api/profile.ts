import { apiClient } from './api-client';
import { ApiResponse } from '@/types/auth';
import { ProfileData } from '@/types/profile';

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<ProfileData>> => {
    const response = await apiClient.get<ApiResponse<ProfileData>>('/profile');
    return response.data;
  },
};
