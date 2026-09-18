'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductsApi } from '@/lib/api/products';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { ProductItem, UpdateProductPayload } from '@/types/product';
import { ApiResponse } from '@/types/auth';

interface UseUpdateProductOptions {
  onSuccessCallback?: (product: ProductItem) => void;
}

export const useUpdateProduct = (options?: UseUpdateProductOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ProductItem>, Error, UpdateProductPayload>({
    mutationFn: ({ id, ...payload }: UpdateProductPayload) =>
      adminProductsApi.updateProduct(id, payload),
    onSuccess: (response) => {
      if (response.success || response.data) {
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'Product updated successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response.data);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to update product';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
