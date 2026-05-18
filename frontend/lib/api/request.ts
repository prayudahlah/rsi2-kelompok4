type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_API_URL');
  }

  let authHeader: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    try {
      // Fallback to previous localStorage-based auth if NextAuth is not present
      const token = localStorage.getItem('accessToken');
      if (token) authHeader = { Authorization: `Bearer ${token}` };
    } catch (e) {
      // ignore
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
  if (response.status === 401) {
    // try to refresh using refresh_token stored in localStorage
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshed = await refreshRes.json();
            localStorage.setItem('accessToken', refreshed.access_token);
            if (refreshed.refresh_token) localStorage.setItem('refreshToken', refreshed.refresh_token);
            localStorage.setItem('expiresAt', String(Date.now() + 15 * 60 * 1000));

            // retry original request with new token
            const newAuthHeader = { Authorization: `Bearer ${refreshed.access_token}` };
            const retryRes = await fetch(`${API_BASE_URL}${path}`, {
              headers: {
                'Content-Type': 'application/json',
                ...newAuthHeader,
                ...(options.headers ?? {}),
              },
              ...options,
              body: options.body ? JSON.stringify(options.body) : undefined,
            });

            if (!retryRes.ok) {
              const msg = await retryRes.text();
              throw new Error(msg || `Request failed (${retryRes.status})`);
            }

            if (retryRes.status === 204) return null as T;
            const ct = retryRes.headers.get('content-type') ?? '';
            if (ct.includes('application/json')) return retryRes.json() as Promise<T>;
            return (await retryRes.text()) as T;
          }
        } catch (e) {
          // fallthrough to clearing tokens
        }
      }
    }

    // failed to refresh -> clear stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('accountId');
      localStorage.removeItem('role');
    }

    const message = await response.text();
    throw new Error(message || 'Sesi telah berakhir. Silakan login kembali.');
  }

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
