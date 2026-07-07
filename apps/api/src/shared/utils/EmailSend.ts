import { Resend } from "resend";
import { RESEND_API_KEY, RESEND_FROM_EMAIL } from "../../config/env.js";

const resend = new Resend(RESEND_API_KEY);

type SendResetPasswordEmailParams = {
    to: string | string[];
    name?: string;
    resetUrl: string;
};

export const sendResetPasswordEmail = async ({
    to,
    name,
    resetUrl,
}: SendResetPasswordEmailParams): Promise<void> => {
    const subject = "Reset your Attendix password";

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">Reset your Attendix password</h2>

      <p>Hello ${name || "User"},</p>

      <p>We received a request to reset your Attendix password.</p>

      <p>Click the button below to choose a new password:</p>

      <p style="margin: 24px 0;">
        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
          "
        >
          Reset Password
        </a>
      </p>

      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetUrl}</p>

      <p>This link will expire in 15 minutes.</p>

      <p>If you did not request this, you can safely ignore this email.</p>

      <p style="margin-top: 24px;">Regards,<br />Attendix Team</p>
    </div>
  `;

    const text = `
Hello ${name || "User"},

We received a request to reset your Attendix password.

Reset your password here:
${resetUrl}

This link will expire in 15 minutes.

If you did not request this, you can safely ignore this email.

Regards,
Attendix Team
  `.trim();

    await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to,
        subject,
        html,
        text,
    });
};