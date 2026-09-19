'use client';

import { useQuery } from '@tanstack/react-query';
import { adminUsersApi, GetAdminUsersParams } from '@/lib/api/adminUsers';
import { AdminUser, AdminUsersMeta } from '@/types/adminUser';

export interface UseGetAdminUsersResult {
  users: AdminUser[];
  meta: AdminUsersMeta;
}

export const useGetAdminUsers = (params?: GetAdminUsersParams) => {
  return useQuery({
    queryKey: ['admin-users', params?.page || 1, params?.limit || 20],
    queryFn: async (): Promise<UseGetAdminUsersResult> => {
      const response = await adminUsersApi.getUsers(params);

      let usersList: AdminUser[] = [];
      let metaInfo: AdminUsersMeta = {
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: 1,
      };

      if (response && response.data) {
        const payload = response.data;
        if (Array.isArray(payload)) {
          usersList = payload;
          metaInfo = {
            total: usersList.length,
            page: params?.page || 1,
            limit: params?.limit || 20,
            totalPages: Math.max(1, Math.ceil(usersList.length / (params?.limit || 20))),
          };
        } else if (typeof payload === 'object' && payload !== null) {
          if (Array.isArray(payload.data)) {
            usersList = payload.data;
          }
          if (payload.meta) {
            metaInfo = {
              total: Number(payload.meta.total) || usersList.length,
              page: Number(payload.meta.page) || (params?.page || 1),
              limit: Number(payload.meta.limit) || (params?.limit || 20),
              totalPages: Number(payload.meta.totalPages) || 1,
            };
          }
        }
      }

      return {
        users: usersList,
        meta: metaInfo,
      };
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });
};
