import { request } from '@/lib/api/request';

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token?: string;
  token?: string;
};

export type MeResponse = {
  id: number;
  username: string;
  role: string;
};

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function getMe(): Promise<MeResponse> {
  return request<MeResponse>('/auth/me');
}
