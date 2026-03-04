import { Resend } from "resend";

let _resend: Resend | null = null;
export function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@iwanttobeapilot.com";
const APP_NAME = "I Want To Be A Pilot";

export async function sendVerificationEmail(email: string, code: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `${APP_NAME} – Verify your email`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#0ea5e9">Verify Your Email</h2>
        <p>Thanks for signing up! Enter this code to verify your email address:</p>
        <div style="font-size:2rem;font-weight:bold;letter-spacing:.5rem;color:#0ea5e9;margin:24px 0">${code}</div>
        <p style="color:#64748b">This code expires in 10 minutes.</p>
      </div>`,
  });
}

export async function sendPasswordResetEmail(email: string, code: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `${APP_NAME} – Reset your password`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#0ea5e9">Reset Your Password</h2>
        <p>Enter this code to reset your password:</p>
        <div style="font-size:2rem;font-weight:bold;letter-spacing:.5rem;color:#0ea5e9;margin:24px 0">${code}</div>
        <p style="color:#64748b">This code expires in 10 minutes. If you didn't request a reset, ignore this email.</p>
      </div>`,
  });
}

export async function sendCronAlertEmail(subject: string, body: string) {
  await getResend().emails.send({
    from: FROM,
    to: "jjjjj_enterprises_llc@protonmail.com",
    subject: `[${APP_NAME}] ${subject}`,
    html: `<div style="font-family:monospace;font-size:13px;white-space:pre-wrap;max-width:700px;margin:auto">${body}</div>`,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to ${APP_NAME}!`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#0ea5e9">Welcome, ${name}!</h2>
        <p>Your account is ready. Start exploring flight schools, resources, and your path to becoming a pilot.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display:inline-block;background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px">Get Started</a>
      </div>`,
  });
}
