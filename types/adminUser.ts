export interface AdminUser {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: string;
  accountType: string;
  balance: string;
  invitationCode: string;
  parentUserId?: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUsersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUsersPaginatedData {
  data: AdminUser[];
  meta: AdminUsersMeta;
}

export interface CreateAgentPayload {
  username: string;
  password: string;
  email: string;
  phone?: string;
}

export interface UpdateAdminUserPayload {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
  accountType?: string;
  balance?: number;
  isActive?: boolean;
}

export interface ModifyBalancePayload {
  type: 'CREDIT' | 'DEBIT' | string;
  amount: number;
  note?: string;
}



