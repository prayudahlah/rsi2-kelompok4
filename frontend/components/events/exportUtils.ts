import type { EventRecord } from '@/lib/api/events';

export function toCsv(records: EventRecord[]): string {
  const header = ['id', 'name', 'description', 'quota', 'started_at', 'ended_at'];
  const rows = records.map((record) => [
    record.id,
    record.name,
    record.description,
    record.quota,
    record.started_at,
    record.ended_at,
  ]);

  const escapeValue = (value: string | number) => {
    const stringValue = String(value ?? '');
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  return [header, ...rows]
    .map((row) => row.map(escapeValue).join(','))
    .join('\n');
}

export function buildExportFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}-${timestamp}.${extension}`;
}

export function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
