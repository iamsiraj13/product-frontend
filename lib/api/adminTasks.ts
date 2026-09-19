import { apiClient } from './api-client';
import { ApiResponse } from '@/types/auth';
import { OverrideTaskPayload, UserTaskItem } from '@/types/task';

export const adminTasksApi = {
  overrideTask: async (
    taskId: string,
    payload: OverrideTaskPayload
  ): Promise<ApiResponse<UserTaskItem>> => {
    const response = await apiClient.patch<ApiResponse<UserTaskItem>>(
      `/admin/tasks/${taskId}/override`,
      payload
    );
    return response.data;
  },
};
