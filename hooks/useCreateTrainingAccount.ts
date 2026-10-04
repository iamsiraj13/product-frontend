'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminUsers';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { AdminUser, CreateTrainingAccountPayload } from '@/types/adminUser';
import { ApiResponse } from '@/types/auth';

interface UseCreateTrainingAccountOptions {
  onSuccessCallback?: (user?: AdminUser) => void;
}

export const useCreateTrainingAccount = (options?: UseCreateTrainingAccountOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AdminUser>, Error, CreateTrainingAccountPayload>({
    mutationFn: (payload: CreateTrainingAccountPayload) => adminUsersApi.createTrainingAccount(payload),
    onSuccess: (response) => {
      if (response.success || response.data) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'Training account created successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response.data);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to create training account';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
