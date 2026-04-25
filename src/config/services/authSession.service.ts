import type { User } from "../../models/user";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";
const AUTH_SESSION_META_KEY = "authSessionMeta";
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

interface AuthSessionMeta {
  issuedAt: number;
  expiresAt: number;
}

export interface StoredAuthSession {
  user: User;
  token: string;
  issuedAt: number;
  expiresAt: number;
}

function cleanupLegacyAuthStorage() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_SESSION_META_KEY);
}

export function normalizeTokenValue(rawToken: unknown): string | null {
  if (!rawToken) return null;

  if (typeof rawToken === "object") {
    const tokenFromObject = (rawToken as { token?: string; accessToken?: string }).token
      || (rawToken as { token?: string; accessToken?: string }).accessToken;
    return normalizeTokenValue(tokenFromObject);
  }

  if (typeof rawToken !== "string") return null;

  const trimmedValue = rawToken.trim().replace(/^"|"$/g, "");
  const normalizedToken = trimmedValue.replace(/^Bearer\s+/i, "").trim();

  return normalizedToken || null;
}

function decodeJwtExpiration(token: string): number | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(`${base64}${padding}`)) as { exp?: unknown };

    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
}

function buildSessionMeta(token: string, expiresAt?: number): AuthSessionMeta {
  const issuedAt = Date.now();
  const tokenExpiration = decodeJwtExpiration(token);

  if (typeof expiresAt === "number" && Number.isFinite(expiresAt) && expiresAt > issuedAt) {
    return {
      issuedAt,
      expiresAt,
    };
  }

  if (tokenExpiration && tokenExpiration > issuedAt) {
    return {
      issuedAt,
      expiresAt: tokenExpiration,
    };
  }

  return {
    issuedAt,
    expiresAt: issuedAt + SESSION_MAX_AGE_MS,
  };
}

function parseUser(rawUser: string | null): User | null {
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

function readSessionMeta(): AuthSessionMeta | null {
  const rawMeta = sessionStorage.getItem(AUTH_SESSION_META_KEY);
  if (!rawMeta) return null;

  try {
    const parsedMeta = JSON.parse(rawMeta) as Partial<AuthSessionMeta>;

    if (
      typeof parsedMeta.issuedAt !== "number"
      || !Number.isFinite(parsedMeta.issuedAt)
      || typeof parsedMeta.expiresAt !== "number"
      || !Number.isFinite(parsedMeta.expiresAt)
    ) {
      return null;
    }

    return {
      issuedAt: parsedMeta.issuedAt,
      expiresAt: parsedMeta.expiresAt,
    };
  } catch {
    return null;
  }
}

function isSessionExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt;
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_SESSION_META_KEY);
  cleanupLegacyAuthStorage();
}

export function persistAuthSession(user: User, token: string, expiresAt?: number): StoredAuthSession {
  const normalizedToken = normalizeTokenValue(token);

  if (!normalizedToken) {
    throw new Error("Invalid auth token");
  }

  const sessionMeta = buildSessionMeta(normalizedToken, expiresAt);
  const storedSession: StoredAuthSession = {
    user,
    token: normalizedToken,
    issuedAt: sessionMeta.issuedAt,
    expiresAt: sessionMeta.expiresAt,
  };

  sessionStorage.setItem(AUTH_TOKEN_KEY, storedSession.token);
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(storedSession.user));
  sessionStorage.setItem(AUTH_SESSION_META_KEY, JSON.stringify({
    issuedAt: storedSession.issuedAt,
    expiresAt: storedSession.expiresAt,
  }));

  cleanupLegacyAuthStorage();

  return storedSession;
}

export function readAuthSession(options?: { clearInvalid?: boolean }): StoredAuthSession | null {
  cleanupLegacyAuthStorage();

  const rawToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const rawUser = sessionStorage.getItem(AUTH_USER_KEY);

  if (!rawToken || !rawUser) {
    if (options?.clearInvalid) {
      clearAuthSession();
    }

    return null;
  }

  const token = normalizeTokenValue(rawToken);
  const user = parseUser(rawUser);
  const sessionMeta = readSessionMeta();
  const tokenExpiration = token ? decodeJwtExpiration(token) : null;
  const expiresAt = Math.min(
    sessionMeta?.expiresAt ?? Number.POSITIVE_INFINITY,
    tokenExpiration ?? Number.POSITIVE_INFINITY,
  );

  if (!token || !user || !Number.isFinite(expiresAt)) {
    if (options?.clearInvalid) {
      clearAuthSession();
    }

    return null;
  }

  if (isSessionExpired(expiresAt)) {
    if (options?.clearInvalid) {
      clearAuthSession();
    }

    return null;
  }

  return {
    user,
    token,
    issuedAt: sessionMeta?.issuedAt ?? Date.now(),
    expiresAt,
  };
}

export function readAuthToken(options?: { clearInvalid?: boolean }): string | null {
  return readAuthSession(options)?.token ?? null;
}

export function hasPersistedAuthSession(): boolean {
  cleanupLegacyAuthStorage();

  return (
    sessionStorage.getItem(AUTH_TOKEN_KEY) !== null
    || sessionStorage.getItem(AUTH_USER_KEY) !== null
    || sessionStorage.getItem(AUTH_SESSION_META_KEY) !== null
  );
}