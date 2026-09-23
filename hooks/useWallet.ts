'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '@/lib/api/wallet';
import { extractErrorMessage } from '@/lib/api/api-client';
import { toast } from 'sonner';
import {
  WalletAddressItem,
  SaveWalletAddressPayload,
  CreateWithdrawalPayload,
} from '@/types/wallet';
import { ApiResponse } from '@/types/auth';

export const useWalletAddresses = () => {
  return useQuery<WalletAddressItem[]>({
    queryKey: ['wallet-addresses'],
    queryFn: async () => {
      const response = await walletApi.getWalletAddresses();
      if (!response || !response.success) {
        throw new Error(
          typeof response?.message === 'string'
            ? response.message
            : 'Failed to fetch wallet addresses'
        );
      }
      return response.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
};

interface UseSaveWalletAddressOptions {
  onSuccessCallback?: (data: ApiResponse<unknown>) => void;
  onErrorCallback?: (error: unknown) => void;
}

export const useSaveWalletAddress = (options?: UseSaveWalletAddressOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<unknown>, Error, SaveWalletAddressPayload>({
    mutationFn: (payload: SaveWalletAddressPayload) =>
      walletApi.saveWalletAddress(payload),
    onSuccess: (response) => {
      if (response.success) {
        let successMsg = `${response.message || 'Wallet address saved successfully!'}`;
        
        // Handle nested response format: { data: { message: "..." } }
        if (
          typeof response.data === 'object' &&
          response.data !== null &&
          'message' in response.data &&
          typeof (response.data as { message?: string }).message === 'string'
        ) {
          successMsg = (response.data as { message: string }).message;
        }

        toast.success(successMsg);
        queryClient.invalidateQueries({ queryKey: ['wallet-addresses'] });
        
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to save wallet address';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      if (options?.onErrorCallback) {
        options.onErrorCallback(error);
      }
    },
  });
};

interface UseCreateWithdrawalOptions {
  onSuccessCallback?: (data: ApiResponse<unknown>) => void;
  onErrorCallback?: (error: unknown) => void;
}

export const useCreateWithdrawal = (options?: UseCreateWithdrawalOptions) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<unknown>, Error, CreateWithdrawalPayload>({
    mutationFn: (payload: CreateWithdrawalPayload) =>
      walletApi.createWithdrawal(payload),
    onSuccess: (response) => {
      if (response.success) {
        let successMsg = `${
          typeof response.message === 'string'
            ? response.message
            : 'Withdrawal request submitted successfully!'
        }`;
        
        if (
          typeof response.data === 'object' &&
          response.data !== null &&
          'message' in response.data &&
          typeof (response.data as { message?: string }).message === 'string'
        ) {
          successMsg = (response.data as { message: string }).message;
        }

        toast.success(successMsg);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
        
        if (options?.onSuccessCallback) {
          options.onSuccessCallback(response);
        }
      } else {
        const errorMsg = response.message
          ? Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message
          : 'Failed to process withdrawal';
        toast.error(errorMsg);
        if (options?.onErrorCallback) {
          options.onErrorCallback(new Error(errorMsg));
        }
      }
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      if (options?.onErrorCallback) {
        options.onErrorCallback(error);
      }
    },
  });
};

