import { apiClient } from './api-client';
import { ApiResponse } from '@/types/auth';
import {
  WalletAddressItem,
  SaveWalletAddressPayload,
  CreateWithdrawalPayload,
  WithdrawalItem,
} from '@/types/wallet';

export const walletApi = {
  getWalletAddresses: async (): Promise<ApiResponse<WalletAddressItem[]>> => {
    const response = await apiClient.get<ApiResponse<WalletAddressItem[]>>('/wallet/addresses');
    return response.data;
  },

  saveWalletAddress: async (
    payload: SaveWalletAddressPayload
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>('/wallet/addresses', payload);
    return response.data;
  },

  createWithdrawal: async (
    payload: CreateWithdrawalPayload
  ): Promise<ApiResponse<WithdrawalItem | unknown>> => {
    const response = await apiClient.post<ApiResponse<WithdrawalItem | unknown>>('/withdrawals', payload);
    return response.data;
  },
};

