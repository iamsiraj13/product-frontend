import { apiClient } from './api-client';
import { RegisterPayload, LoginPayload, ApiResponse, RegisterResponseData, LoginResponseData } from '@/types/auth';

export const authApi = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<RegisterResponseData>> => {
    const response = await apiClient.post<ApiResponse<RegisterResponseData>>(
      '/auth/register',
      payload
    );
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      payload
    );
    return response.data;
  },
};
