'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userTasksApi } from '@/lib/api/userTasks';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/auth';
import { UserTaskItem } from '@/types/task';

interface UseStartTaskOptions {
  onSuccessCallback?: (data: ApiResponse<UserTaskItem>) => void;
  onErrorCallback?: (error: unknown) => void;
}

export const useStartTask = (options?: UseStartTaskOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserTaskItem>, Error, string>({
    mutationFn: (taskId: string) => userTasksApi.startTask(taskId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : 'Task started successfully!'
        );
        queryClient.invalidateQueries({ queryKey: ['pending-task'] });
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to start task';
        toast.error(errorMsg);
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
