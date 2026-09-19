'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTasksApi } from '@/lib/api/adminTasks';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/auth';
import { OverrideTaskPayload, UserTaskItem } from '@/types/task';

interface UseOverrideTaskOptions {
  onSuccessCallback?: (data?: UserTaskItem) => void;
}

export const useOverrideTask = (options?: UseOverrideTaskOptions) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserTaskItem>,
    Error,
    { taskId: string; payload: OverrideTaskPayload }
  >({
    mutationFn: ({ taskId, payload }) => adminTasksApi.overrideTask(taskId, payload),
    onSuccess: (response) => {
      if (response.success || response.statusCode === 200 || response.data) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
        queryClient.invalidateQueries({ queryKey: ['admin-user-tasks'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'Task overridden successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response.data);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to override task';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
