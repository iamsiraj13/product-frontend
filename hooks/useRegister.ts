'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { extractErrorMessage } from '@/lib/api/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import { RegisterPayload, ApiResponse, RegisterResponseData } from '@/types/auth';

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<ApiResponse<RegisterResponseData>, Error, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setAuth({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
      }
    },
    onError: (error) => {
      console.error('Registration failed:', extractErrorMessage(error));
    },
  });
};
