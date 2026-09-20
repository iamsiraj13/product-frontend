'use client';

import { useQuery } from '@tanstack/react-query';
import { userTasksApi } from '@/lib/api/userTasks';
import { UserTaskItem } from '@/types/task';
import { ApiResponse } from '@/types/auth';

export const PENDING_TASK_QUERY_KEY = ['pending-task'];

export const usePendingTask = (enabled: boolean = true) => {
  return useQuery<ApiResponse<UserTaskItem | null>, Error>({
    queryKey: PENDING_TASK_QUERY_KEY,
    queryFn: () => userTasksApi.getPendingTask(),
    enabled,
    refetchOnWindowFocus: false,
  });
};
