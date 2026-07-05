export const appConfig = {
  name: process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "KontriLab",
  url: process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  adminUrl: process.env.APP_ADMIN_URL || "",
};

export const publicAppConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || appConfig.name,
  url: process.env.NEXT_PUBLIC_APP_URL || appConfig.url,
};

export const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  fromName: process.env.SMTP_FROM_NAME || appConfig.name,
  fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
};

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function getAppUrl(fallbackOrigin?: string) {
  return appConfig.url || fallbackOrigin || "http://localhost:3000";
}
