import { apiClient } from './api-client';
import { ApiResponse } from '@/types/auth';
import { CreateProductPayload, ProductItem, ProductsPaginatedData, UpdateProductPayload } from '@/types/product';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const adminProductsApi = {
  createProduct: async (payload: CreateProductPayload): Promise<ApiResponse<ProductItem>> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('price', payload.price.toString());
    formData.append('commissionRate', payload.commissionRate.toString());
    formData.append('commission', payload.commission.toString());
    formData.append('isHomeProduct', String(payload.isHomeProduct));
    formData.append('isActive', String(payload.isActive));
    formData.append('image', payload.image);

    const response = await apiClient.post<ApiResponse<ProductItem>>(
      '/admin/products',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  updateProduct: async (
    id: string,
    payload: Omit<UpdateProductPayload, 'id'>
  ): Promise<ApiResponse<ProductItem>> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('price', payload.price.toString());
    formData.append('commissionRate', payload.commissionRate.toString());
    formData.append('commission', payload.commission.toString());
    formData.append('isHomeProduct', String(payload.isHomeProduct));
    formData.append('isActive', String(payload.isActive));
    if (payload.image) {
      formData.append('image', payload.image);
    }

    const response = await apiClient.put<ApiResponse<ProductItem>>(
      `/admin/products/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getProducts: async (
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductsPaginatedData | ProductItem[]>> => {
    const response = await apiClient.get<ApiResponse<ProductsPaginatedData | ProductItem[]>>(
      '/admin/products',
      {
        params,
      }
    );
    return response.data;
  },
};


