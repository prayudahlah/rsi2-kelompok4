import { request } from '@/lib/api/request';

export type LoginPayload = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type?: string;
  account_id: number;
  role: string;
};

export type MeResponse = {
  id: number;
  username: string;
  role: string;
};

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  whatsapp: string;
  role_name?: string;
};

export function login(payload: LoginPayload): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function register(payload: RegisterPayload): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function getMe(): Promise<MeResponse> {
  return request<MeResponse>('/auth/me');
}
