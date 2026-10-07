'use client';

import { useMutation } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { ChangePasswordPayload } from '@/types/profile';
import { ApiResponse } from '@/types/auth';

export const useChangePassword = () => {
  return useMutation<ApiResponse<null>, Error, ChangePasswordPayload>({
    mutationFn: (payload: ChangePasswordPayload) => profileApi.changePassword(payload),
  });
};
