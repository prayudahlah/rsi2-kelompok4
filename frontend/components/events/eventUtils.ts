export type EventFormValues = {
  name: string;
  description: string;
  quota: string;
  startedAt: string;
  endedAt: string;
};

export function toLocalInputValue(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function toIsoString(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

export function formatDisplayDate(value: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function buildFormValues(values?: Partial<EventFormValues>): EventFormValues {
  return {
    name: values?.name ?? '',
    description: values?.description ?? '',
    quota: values?.quota ?? '',
    startedAt: values?.startedAt ?? '',
    endedAt: values?.endedAt ?? '',
  };
}
