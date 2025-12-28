import { Resend } from "resend";
import { env } from "../../@core/config/env";

const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  if (!resend) {
    console.log(`📧 Email skipped (no API key): ${subject}`);
    return;
  }

  try {
    const data = await resend.emails.send({
      from: "Prava Security <security@prava.app>",
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${data.data?.id}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};
