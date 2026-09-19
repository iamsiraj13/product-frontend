'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminUsers';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/auth';
import { PreGenerateTasksData } from '@/types/task';

interface UsePreGenerateTasksOptions {
  onSuccessCallback?: (data: ApiResponse<PreGenerateTasksData>) => void;
}

export const usePreGenerateTasks = (options?: UsePreGenerateTasksOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<PreGenerateTasksData>, Error, { userId: string; count: number }>({
    mutationFn: ({ userId, count }) => adminUsersApi.preGenerateTasks(userId, count),
    onSuccess: (response) => {
      if (response.success || response.statusCode === 200 || response.statusCode === 201) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        queryClient.invalidateQueries({ queryKey: ['admin-user-tasks'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
              ? response.message.join(', ')
              : response.data?.message || 'Tasks pre-generated successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to pre-generate tasks';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
