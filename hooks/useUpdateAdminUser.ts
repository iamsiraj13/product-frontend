'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminUsers';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { AdminUser, UpdateAdminUserPayload } from '@/types/adminUser';
import { ApiResponse } from '@/types/auth';

interface UseUpdateAdminUserOptions {
  onSuccessCallback?: (updatedUser?: AdminUser) => void;
}

export const useUpdateAdminUser = (options?: UseUpdateAdminUserOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AdminUser>, Error, { id: string; payload: UpdateAdminUserPayload }>({
    mutationFn: ({ id, payload }) => adminUsersApi.updateUser(id, payload),
    onSuccess: (response) => {
      if (response.success || response.data) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'User updated successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response.data);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to update user';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
