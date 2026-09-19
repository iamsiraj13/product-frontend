'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminUsers';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/auth';

interface UseDeleteAdminUserOptions {
  onSuccessCallback?: () => void;
}

export const useDeleteAdminUser = (options?: UseDeleteAdminUserOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: (id: string) => adminUsersApi.deleteUser(id),
    onSuccess: (response) => {
      if (response.success || response.statusCode === 200 || response.statusCode === 204) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'User deleted successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback();
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to delete user';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
