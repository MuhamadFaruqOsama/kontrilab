import nodemailer from "nodemailer";

import { appConfig, smtpConfig } from "@/lib/env";
import { renderPasswordResetEmail, renderVerificationEmail } from "@/lib/email/views/auth";

function requireSmtpConfig() {
  if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass || !smtpConfig.fromEmail) {
    throw new Error("SMTP environment variables are not configured.");
  }
}

function createTransporter() {
  requireSmtpConfig();

  return nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });
}

export async function sendVerificationEmail({ to, username, actionUrl }: { to: string; username: string; actionUrl: string }) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
    to,
    subject: `Verifikasi akun ${appConfig.name}`,
    html: renderVerificationEmail({ username, actionUrl }),
  });
}

export async function sendPasswordResetEmail({ to, actionUrl }: { to: string; actionUrl: string }) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
    to,
    subject: `Reset kata sandi ${appConfig.name}`,
    html: renderPasswordResetEmail({ actionUrl }),
  });
}
