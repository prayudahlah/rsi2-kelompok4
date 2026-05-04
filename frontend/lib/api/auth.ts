import { request } from '@/lib/api/request';

export type MeResponse = {
  id: number;
  username: string;
  role: string;
};

export function getMe(): Promise<MeResponse> {
  return request<MeResponse>('/auth/me');
}
