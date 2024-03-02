import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerficationEmail = async (email: string, token: string) => {
  const confirmationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "no-reply@guludoc.com",
    to: email,
    subject: "Verify your email",
    html: `<p>Click to <a href="${confirmationLink}">Verify your email</a></p>`
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.SERVER_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@guludoc.com",
    to: email,
    subject: "Reset your password on Guludoc.com",
    html: `<p>Click to <a href="${resetLink}">Reset your password</a>`
  });
}
