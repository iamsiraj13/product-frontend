'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminUsers';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { AdminUser, CreateAgentPayload } from '@/types/adminUser';
import { ApiResponse } from '@/types/auth';

interface UseCreateAdminAgentOptions {
  onSuccessCallback?: (user?: AdminUser) => void;
}

export const useCreateAdminAgent = (options?: UseCreateAdminAgentOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AdminUser>, Error, CreateAgentPayload>({
    mutationFn: (payload: CreateAgentPayload) => adminUsersApi.createAgent(payload),
    onSuccess: (response) => {
      if (response.success || response.data) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'User created successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response.data);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to create user';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
