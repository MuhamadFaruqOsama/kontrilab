import { appConfig } from "@/lib/env";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function baseEmailTemplate({ title, intro, buttonLabel, actionUrl, note }: { title: string; intro: string; buttonLabel: string; actionUrl: string; note: string }) {
  const safeTitle = escapeHtml(title);
  const safeIntro = escapeHtml(intro);
  const safeButton = escapeHtml(buttonLabel);
  const safeActionUrl = escapeHtml(actionUrl);
  const safeNote = escapeHtml(note);
  const safeAppName = escapeHtml(appConfig.name);

  return `
    <div style="margin:0;background:#f7faf8;padding:32px 16px;font-family:Nunito Sans,Arial,sans-serif;color:#2b3033;">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #eeeeee;border-radius:12px;padding:28px;">
        <p style="margin:0 0 12px;color:#57c186;font-size:14px;font-weight:700;">${safeAppName}</p>
        <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:700;color:#2b3033;">${safeTitle}</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#5f6b70;">${safeIntro}</p>
        <a href="${safeActionUrl}" style="display:inline-block;background:#57c186;color:#ffffff;text-decoration:none;border-radius:10px;padding:13px 22px;font-size:15px;font-weight:700;">${safeButton}</a>
        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#879196;">${safeNote}</p>
        <p style="margin:16px 0 0;font-size:12px;line-height:1.6;color:#879196;word-break:break-all;">Jika tombol tidak bisa dibuka, salin link ini:<br>${safeActionUrl}</p>
      </div>
    </div>
  `;
}

export function renderVerificationEmail({ username, actionUrl }: { username: string; actionUrl: string }) {
  return baseEmailTemplate({
    title: "Verifikasi akunmu",
    intro: `Halo ${username}, klik tombol di bawah untuk mengaktifkan akun dan mulai menggunakan ${appConfig.name}.`,
    buttonLabel: "Verifikasi Email",
    actionUrl,
    note: "Link ini hanya untuk email yang kamu daftarkan. Abaikan email ini jika kamu tidak merasa membuat akun.",
  });
}

export function renderPasswordResetEmail({ actionUrl }: { actionUrl: string }) {
  return baseEmailTemplate({
    title: "Reset password akunmu",
    intro: "Kami menerima permintaan untuk mengatur ulang password akunmu. Klik tombol di bawah untuk melanjutkan.",
    buttonLabel: "Reset Password",
    actionUrl,
    note: "Jika kamu tidak meminta reset password, abaikan email ini dan password lama tetap berlaku.",
  });
}
