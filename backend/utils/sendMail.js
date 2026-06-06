import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  const data = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });

  return data;
};

export default sendMail;
