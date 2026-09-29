import { Resend } from "resend";

// Created on first use instead of at import time — `new Resend()` throws when
// RESEND_API_KEY is missing, which used to crash the whole server on startup
// instead of just failing the password-reset email.
let resend;

const sendMail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email service is not configured");
  }
  resend ??= new Resend(process.env.RESEND_API_KEY);

  const data = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });

  return data;
};

export default sendMail;
