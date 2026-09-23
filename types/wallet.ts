export enum CryptoNetwork {
  TRC20 = 'TRC20',
  ERC20 = 'ERC20',
  BTC = 'BTC',
}

export interface WalletAddressItem {
  id: string;
  userId?: string;
  network: CryptoNetwork | string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveWalletAddressPayload {
  network: CryptoNetwork | string;
  address: string;
}

export interface CreateWithdrawalPayload {
  amount: number;
  network: CryptoNetwork | string;
  withdrawalPassword: string;
}

export interface WithdrawalItem {
  id: string;
  userId?: string;
  amount: number;
  network: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

