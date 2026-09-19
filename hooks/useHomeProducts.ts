'use client';

import { useQuery } from '@tanstack/react-query';
import { getHomeProducts } from '@/lib/api/products';
import { ProductItem } from '@/types/product';

export const useHomeProducts = () => {
  return useQuery<ProductItem[]>({
    queryKey: ['home-products'],
    queryFn: async (): Promise<ProductItem[]> => {
      const response = await getHomeProducts();
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });
};
