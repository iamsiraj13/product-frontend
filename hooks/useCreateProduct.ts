'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductsApi } from '@/lib/api/products';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { CreateProductPayload, ProductItem } from '@/types/product';
import { ApiResponse } from '@/types/auth';

interface UseCreateProductOptions {
  onSuccessCallback?: (product: ProductItem) => void;
}

export const useCreateProduct = (options?: UseCreateProductOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ProductItem>, Error, CreateProductPayload>({
    mutationFn: (payload: CreateProductPayload) => adminProductsApi.createProduct(payload),
    onSuccess: (response) => {
      if (response.success || response.data) {
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'Product created successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response.data);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to create product';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};

