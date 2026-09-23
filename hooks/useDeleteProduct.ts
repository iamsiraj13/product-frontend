'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductsApi } from '@/lib/api/products';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/auth';

interface UseDeleteProductOptions {
  onSuccessCallback?: () => void;
}

export const useDeleteProduct = (options?: UseDeleteProductOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: (id: string) => adminProductsApi.deleteProduct(id),
    onSuccess: (response) => {
      if (response.success || response.statusCode === 200 || response.statusCode === 204) {
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        toast.success(
          typeof response.message === 'string'
            ? response.message
            : Array.isArray(response.message)
            ? response.message.join(', ')
            : 'Product deleted successfully!'
        );
        if (options?.onSuccessCallback) {
          options.onSuccessCallback();
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to delete product';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
    },
  });
};
