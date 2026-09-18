'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { extractErrorMessage } from '@/lib/api/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { LoginPayload, ApiResponse, LoginResponseData } from '@/types/auth';

interface UseLoginOptions {
  onSuccessCallback?: () => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<ApiResponse<LoginResponseData>, Error, LoginPayload>({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, accessToken } = response.data;
        setAuth({
          user,
          accessToken,
        });

        toast.success(`Welcome back, ${user.username || 'User'}!`);

        if (options?.onSuccessCallback) {
          options.onSuccessCallback();
        }

        const roleUpper = (user.role || 'USER').toUpperCase();
        if (roleUpper === 'ADMIN' || roleUpper === 'AGENT') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        toast.error(response.message ? (Array.isArray(response.message) ? response.message.join(', ') : response.message) : 'Login failed');
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
