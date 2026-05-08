import { request } from '@/lib/api/request';

export type EventRecord = {
  id: number;
  name: string;
  description: string;
  quota: number;
  started_at: string;
  ended_at: string;
};

export type EventCreatePayload = {
  name: string;
  description: string;
  quota: number;
  started_at: string;
  ended_at: string;
};

export type EventUpdatePayload = Partial<EventCreatePayload>;

export function listEvents(): Promise<EventRecord[]> {
  return request<EventRecord[]>('/events/');
}

export function createEvent(payload: EventCreatePayload): Promise<EventRecord> {
  return request<EventRecord>('/events/', {
    method: 'POST',
    body: payload,
  });
}

export function updateEvent(id: number, payload: EventUpdatePayload): Promise<EventRecord> {
  return request<EventRecord>(`/events/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export function deleteEvent(id: number): Promise<void> {
  return request<void>(`/events/${id}`, {
    method: 'DELETE',
  });
}

export function registerEvent(eventId: number): Promise<void> {
  return request<void>('/events/register', {
    method: 'POST',
    body: { event_id: eventId },
  });
}