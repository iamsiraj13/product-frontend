'use client';

import { useQuery } from '@tanstack/react-query';
import { adminProductsApi, GetProductsParams } from '@/lib/api/products';
import { ProductItem, ProductMeta, ProductsPaginatedData } from '@/types/product';

export interface UseGetProductsResult {
  products: ProductItem[];
  meta: ProductMeta;
}

export const useGetProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: ['admin-products', params],
    queryFn: async (): Promise<UseGetProductsResult> => {
      const response = await adminProductsApi.getProducts(params);
      
      let productsList: ProductItem[] = [];
      let metaInfo: ProductMeta = {
        total: 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: 1,
      };

      if (response && response.data) {
        const dataPayload = response.data;
        if (Array.isArray(dataPayload)) {
          productsList = dataPayload;
          metaInfo = {
            total: productsList.length,
            page: params?.page || 1,
            limit: params?.limit || 10,
            totalPages: Math.max(1, Math.ceil(productsList.length / (params?.limit || 10))),
          };
        } else if (typeof dataPayload === 'object' && 'data' in dataPayload) {
          const paginated = dataPayload as ProductsPaginatedData;
          productsList = Array.isArray(paginated.data) ? paginated.data : [];
          if (paginated.meta) {
            metaInfo = {
              total: Number(paginated.meta.total) || productsList.length,
              page: Number(paginated.meta.page) || (params?.page || 1),
              limit: Number(paginated.meta.limit) || (params?.limit || 10),
              totalPages: Number(paginated.meta.totalPages) || 1,
            };
          }
        }
      }

      return {
        products: productsList,
        meta: metaInfo,
      };
    },
    placeholderData: (previousData) => previousData,
  });
};
