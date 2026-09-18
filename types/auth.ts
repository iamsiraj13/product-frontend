export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone: string;
  invitationCode: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  accountType: string;
  balance: string;
  invitationCode: string;
  createdAt?: string;
}

export interface RegisterResponseData {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
  message?: string | string[];
  error?: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  statusCode?: number;
  message?: string | string[];
  error?: string;
  timestamp?: string;
}
