'use client';

import { useQuery } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminUsers';
import { UserTasksData } from '@/types/task';
import { ApiResponse } from '@/types/auth';

export const useGetUserTasks = (userId?: string | null, enabled: boolean = true) => {
  return useQuery<ApiResponse<UserTasksData>, Error>({
    queryKey: ['admin-user-tasks', userId],
    queryFn: () => adminUsersApi.getUserTasks(userId!),
    enabled: !!userId && enabled,
    refetchOnWindowFocus: false,
  });
};
