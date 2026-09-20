'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userTasksApi } from '@/lib/api/userTasks';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/auth';
import { UserTaskItem, SubmitTaskPayload } from '@/types/task';

export interface SubmitTaskVariables {
  taskId: string;
  payload: SubmitTaskPayload;
}

interface UseSubmitTaskOptions {
  onSuccessCallback?: (data: ApiResponse<UserTaskItem>) => void;
  onErrorCallback?: (error: unknown) => void;
}

export const useSubmitTask = (options?: UseSubmitTaskOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UserTaskItem>, Error, SubmitTaskVariables>({
    mutationFn: ({ taskId, payload }: SubmitTaskVariables) =>
      userTasksApi.submitTask(taskId, payload),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : 'Task submitted successfully!'
        );
        queryClient.invalidateQueries({ queryKey: ['pending-task'] });
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        queryClient.invalidateQueries({ queryKey: ['admin-user-tasks'] });
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to submit task';
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
