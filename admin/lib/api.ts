import type { PaginationMeta } from "@/lib/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const BASE = `${API_URL}/api/v1`;

const ACCESS_KEY = "tecim.access";
const REFRESH_KEY = "tecim.refresh";
const SESSION_COOKIE = "tecim_admin";

export function getTokens(): { accessToken: string; refreshToken: string } | null {
  if (typeof window === "undefined") return null;
  const accessToken = window.localStorage.getItem(ACCESS_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setTokens(accessToken: string, refreshToken: string): void {
  window.localStorage.setItem(ACCESS_KEY, accessToken);
  window.localStorage.setItem(REFRESH_KEY, refreshToken);
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function clearTokens(): void {
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function isAuthenticated(): boolean {
  return getTokens() !== null;
}

export async function ensureFreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens) return null;
  const payload = decodeJwtPayload(tokens.accessToken);
  const expiresAt = payload?.exp ? payload.exp * 1000 : 0;
  if (expiresAt > Date.now() + 60_000) return tokens.accessToken;
  refreshPromise = refreshPromise ?? performRefresh(tokens.refreshToken);
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const padded = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as { exp?: number };
  } catch {
    return null;
  }
}

export function redirectToLogin(): void {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export class ApiError extends Error {
  status: number;
  code: string;
  details: unknown[] | undefined;

  constructor(status: number, code: string, message: string, details?: unknown[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  formData?: FormData;
};

let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(refreshToken: string): Promise<string | null> {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { success: boolean; data: { accessToken: string; refreshToken: string } };
  if (!json.success) return null;
  setTokens(json.data.accessToken, json.data.refreshToken);
  return json.data.accessToken;
}

type RequestResult<T> = { data: T; meta?: PaginationMeta };

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<RequestResult<T>> {
  const { method = "GET", body, auth = true, formData } = options;
  const url = `${BASE}${path}`;

  const doFetch = async (token?: string): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (!formData) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(url, {
      method,
      headers,
      body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  };

  const tokens = auth ? getTokens() : null;
  let res = await doFetch(tokens?.accessToken);

  if (res.status === 401 && auth && tokens) {
    refreshPromise = refreshPromise ?? performRefresh(tokens.refreshToken);
    const newAccess = await refreshPromise;
    refreshPromise = null;
    if (newAccess) {
      res = await doFetch(newAccess);
    } else {
      redirectToLogin();
      throw new ApiError(401, "UNAUTHORIZED", "Session expired. Please log in again.");
    }
  }

  if (res.status === 204) {
    return { data: undefined as T };
  }

  const json = (await res.json().catch(() => null)) as
    | ApiEnvelopeShape<T>
    | ApiErrorShape
    | null;

  if (!res.ok || !json || json.success !== true) {
    const err = (json as ApiErrorShape | null)?.error;
    throw new ApiError(
      res.status,
      err?.code ?? "INTERNAL",
      err?.message ?? "Request failed",
      err?.details
    );
  }

  const envelope = json as ApiEnvelopeShape<T>;
  return { data: envelope.data, meta: envelope.meta };
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const result = await request<T>(path, options);
  return result.data;
}

export async function apiFetchPaginated<T>(
  path: string,
  options: RequestOptions = {}
): Promise<{ items: T; meta: PaginationMeta }> {
  const result = await request<T>(path, options);
  const meta = result.meta ?? { page: 1, perPage: 20, total: 0 };
  return {
    items: result.data,
    meta: {
      page: meta.page,
      perPage: meta.perPage,
      total: meta.total,
      totalPages: Math.max(1, Math.ceil(meta.total / Math.max(1, meta.perPage))),
    },
  };
}

type ApiEnvelopeShape<T> = { success: true; data: T; meta?: PaginationMeta };
type ApiErrorShape = { success: false; error: { code: string; message: string; details?: unknown[] } };

export async function login(email: string, password: string): Promise<void> {
  const data = await apiFetch<{ tokens: { accessToken: string; refreshToken: string }; user: { email: string } }>(
    "/auth/login",
    { method: "POST", body: { email, password }, auth: false }
  );
  setTokens(data.tokens.accessToken, data.tokens.refreshToken);
  window.localStorage.setItem("tecim.email", data.user.email);
}

export async function logout(): Promise<void> {
  const tokens = getTokens();
  if (tokens) {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
        body: { refreshToken: tokens.refreshToken },
      });
    } catch {
      // ignore network failures during logout
    }
  }
  clearTokens();
  window.location.href = "/login";
}
