import sgMail from "@sendgrid/mail";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  if (!env.sendgridApiKey || !env.fromEmail) {
    logger.warn(`SendGrid not configured; OTP email skipped for ${to}`);
    return;
  }
  try {
    sgMail.setApiKey(env.sendgridApiKey);
    await sgMail.send({
      to,
      from: env.fromEmail,
      subject: "Your TECIM admin password reset code",
      text: `Your password reset code is ${otp}. It expires in 5 minutes. If you did not request this, you can ignore this email.`,
      html: `<p>Your TECIM admin password reset code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes. If you did not request this, you can ignore this email.</p>`,
    });
    logger.info(`OTP email sent to ${to}`);
  } catch (err) {
    logger.error("SendGrid OTP email failed", err);
    throw err;
  }
}
