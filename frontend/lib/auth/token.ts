const TOKEN_KEY = 'accessToken';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event('auth-changed'));
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expiresAt');
  localStorage.removeItem('accountId');
  localStorage.removeItem('role');
  window.dispatchEvent(new Event('auth-changed'));
}
