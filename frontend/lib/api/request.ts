type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_API_URL');
  }

  let authHeader: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const { getToken } = await import('@/lib/auth/token');
    const token = getToken();
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` };
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(options.headers ?? {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return (await response.text()) as T;
}
