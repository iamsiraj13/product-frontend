'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminUsers';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { AdminUser, ModifyBalancePayload } from '@/types/adminUser';
import { ApiResponse } from '@/types/auth';

interface UseModifyUserBalanceOptions {
  onSuccessCallback?: (data?: ApiResponse<AdminUser>) => void;
}

export const useModifyUserBalance = (options?: UseModifyUserBalanceOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AdminUser>, Error, { id: string; payload: ModifyBalancePayload }>({
    mutationFn: ({ id, payload }) => adminUsersApi.modifyUserBalance(id, payload),
    onSuccess: (response) => {
      if (response.success || response.statusCode === 200 || response.statusCode === 201 || response.data) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'User balance updated successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to update balance';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
