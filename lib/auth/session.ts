export enum AppRole {
  GURU = "guru",
  SISWA = "siswa",
}

export type AuthSession = {
  email: string;
  role: AppRole;
  userId?: string;
  name?: string;
};

export const AUTH_COOKIE_NAME = "kontrilab-auth";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function isAppRole(value: unknown): value is AppRole {
  return value === AppRole.GURU || value === AppRole.SISWA;
}

export function getDashboardPath(role: AppRole) {
  return role === AppRole.GURU ? "/teacher" : "/student";
}

export function parseAuthSession(value: string | undefined | null): AuthSession | null {
  if (!value) return null;

  try {
    const decoded = value.includes("%") ? decodeURIComponent(value) : value;
    const parsed = JSON.parse(decoded) as Partial<AuthSession> & { role?: unknown };
    if (typeof parsed.email !== "string" || !parsed.email.trim() || !isAppRole(parsed.role)) {
      return null;
    }

    return {
      email: parsed.email,
      role: parsed.role,
      userId: typeof parsed.userId === "string" && parsed.userId.trim() ? parsed.userId : undefined,
      name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name : undefined,
    };
  } catch {
    return null;
  }
}

export function serializeAuthSession(session: AuthSession) {
  return JSON.stringify({
    email: session.email,
    role: session.role,
    userId: session.userId,
    name: session.name,
  });
}

export function createAuthCookie(session: AuthSession) {
  return {
    name: AUTH_COOKIE_NAME,
    value: serializeAuthSession(session),
    options: {
      httpOnly: false,
      sameSite: "lax" as const,
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: "/",
    },
  };
}

export function clearAuthCookie() {
  return {
    name: AUTH_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: false,
      sameSite: "lax" as const,
      maxAge: 0,
      path: "/",
    },
  };
}
