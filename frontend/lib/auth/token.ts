import Cookies from "js-cookie";

const TOKEN_KEY = "rsi-auth-token";

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: 1,
    sameSite: "lax",
  });

  window.dispatchEvent(new Event("auth-changed"));
}

export function clearToken(): void {
  Cookies.remove(TOKEN_KEY);

  window.dispatchEvent(new Event("auth-changed"));
}
