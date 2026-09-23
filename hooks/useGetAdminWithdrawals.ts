'use client';

import { useQuery } from '@tanstack/react-query';
import { adminWithdrawalsApi } from '@/lib/api/adminWithdrawals';
import {
  AdminWithdrawalItem,
  AdminWithdrawalsMeta,
  GetAdminWithdrawalsParams,
} from '@/types/adminWithdrawal';

export interface UseGetAdminWithdrawalsResult {
  withdrawals: AdminWithdrawalItem[];
  meta: AdminWithdrawalsMeta;
}

export const useGetAdminWithdrawals = (params?: GetAdminWithdrawalsParams) => {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const status = params?.status;

  return useQuery({
    queryKey: ['admin-withdrawals', page, limit, status],
    queryFn: async (): Promise<UseGetAdminWithdrawalsResult> => {
      const response = await adminWithdrawalsApi.getWithdrawals({
        page,
        limit,
        status,
      });

      let items: AdminWithdrawalItem[] = [];
      let metaInfo: AdminWithdrawalsMeta = {
        total: 0,
        page,
        limit,
        totalPages: 1,
      };

      if (response && response.data) {
        const payload = response.data;

        // Check if data is nested object { data: [...], meta: {...} }
        if (typeof payload === 'object' && !Array.isArray(payload) && payload !== null) {
          const nestedObj = payload as { data?: AdminWithdrawalItem[]; meta?: AdminWithdrawalsMeta };
          if (Array.isArray(nestedObj.data)) {
            items = nestedObj.data;
          }
          if (nestedObj.meta) {
            metaInfo = {
              total: Number(nestedObj.meta.total) || items.length,
              page: Number(nestedObj.meta.page) || page,
              limit: Number(nestedObj.meta.limit) || limit,
              totalPages: Number(nestedObj.meta.totalPages) || Math.max(1, Math.ceil(items.length / limit)),
            };
          } else {
            metaInfo = {
              total: items.length,
              page,
              limit,
              totalPages: Math.max(1, Math.ceil(items.length / limit)),
            };
          }
        }
        // If response.data is direct array
        else if (Array.isArray(payload)) {
          items = payload as AdminWithdrawalItem[];
          metaInfo = {
            total: items.length,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(items.length / limit)),
          };
        }
      }

      return {
        withdrawals: items,
        meta: metaInfo,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
    refetchOnWindowFocus: true,
  });
};
