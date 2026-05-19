import { request } from '@/lib/api/request';

export type UserRecord = {
  id: number;
  first_name: string;
  last_name: string;
  whatsapp: string;
  created_at: string;
  updated_at: string;
};

export function listUsers(): Promise<UserRecord[]> {
  return request<UserRecord[]>('/users/');
}
