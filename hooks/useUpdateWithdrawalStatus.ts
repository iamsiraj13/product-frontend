'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminWithdrawalsApi } from '@/lib/api/adminWithdrawals';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import {
  UpdateWithdrawalStatusPayload,
  AdminWithdrawalsApiResponse,
} from '@/types/adminWithdrawal';

interface UseUpdateWithdrawalStatusOptions {
  onSuccessCallback?: (data: AdminWithdrawalsApiResponse) => void;
  onErrorCallback?: (error: unknown) => void;
}

export const useUpdateWithdrawalStatus = (
  options?: UseUpdateWithdrawalStatusOptions
) => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminWithdrawalsApiResponse,
    Error,
    { id: string; payload: UpdateWithdrawalStatusPayload }
  >({
    mutationFn: ({ id, payload }) =>
      adminWithdrawalsApi.updateStatus(id, payload),
    onSuccess: (response) => {
      if (response && response.success !== false) {
        const message =
          typeof response.message === 'string'
            ? response.message
            : 'Withdrawal status updated successfully';
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
        queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response);
        }
      } else {
        const errorMsg =
          typeof response?.message === 'string'
            ? response.message
            : 'Failed to update withdrawal status';
        toast.error(errorMsg);
        if (options?.onErrorCallback) {
          options.onErrorCallback(new Error(errorMsg));
        }
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      if (options?.onErrorCallback) {
        options.onErrorCallback(error);
      }
    },
  });
};
