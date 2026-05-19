import { request } from '@/lib/api/request';

export type RegistrationRecord = {
  id: number;
  user_id: number;
  event_id: number;
};

export function listRegistrations(): Promise<RegistrationRecord[]> {
  return request<RegistrationRecord[]>('/registrations/');
}
