import { apiClient } from './api-client';
import { ApiResponse } from '@/types/auth';
import { AdminUser, AdminUsersPaginatedData, CreateAgentPayload, UpdateAdminUserPayload, ModifyBalancePayload } from '@/types/adminUser';

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
}

export const adminUsersApi = {
  getUsers: async (params?: GetAdminUsersParams): Promise<ApiResponse<AdminUsersPaginatedData>> => {
    const response = await apiClient.get<ApiResponse<AdminUsersPaginatedData>>('/admin/users', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20,
      },
    });
    return response.data;
  },
  createAgent: async (payload: CreateAgentPayload): Promise<ApiResponse<AdminUser>> => {
    const response = await apiClient.post<ApiResponse<AdminUser>>('/admin/agents', payload);
    return response.data;
  },
  updateUser: async (id: string, payload: UpdateAdminUserPayload): Promise<ApiResponse<AdminUser>> => {
    const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}`, payload);
    return response.data;
  },
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/admin/users/${id}`);
    return response.data;
  },
  modifyUserBalance: async (id: string, payload: ModifyBalancePayload): Promise<ApiResponse<AdminUser>> => {
    const response = await apiClient.post<ApiResponse<AdminUser>>(`/admin/users/${id}/balance`, payload);
    return response.data;
  },
};



