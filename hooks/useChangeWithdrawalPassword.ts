'use client';

import { useMutation } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { ChangeWithdrawalPasswordPayload } from '@/types/profile';
import { ApiResponse } from '@/types/auth';

export const useChangeWithdrawalPassword = () => {
  return useMutation<ApiResponse<null>, Error, ChangeWithdrawalPasswordPayload>({
    mutationFn: (payload: ChangeWithdrawalPasswordPayload) => profileApi.changeWithdrawalPassword(payload),
  });
};
