import { sendEmail } from "../../shared/services/email/email.service.js";
import { buildResetPasswordTemplate } from "../../shared/services/email/templates/reset-password.template.js";

type SendResetPasswordEmailParams = {
    to: string;
    name?: string;
    resetUrl: string;
};

export const sendResetPasswordEmail = async ({
    to,
    name,
    resetUrl,
}: SendResetPasswordEmailParams): Promise<void> => {
    const template = buildResetPasswordTemplate({
        name,
        resetUrl,
    });

    await sendEmail({
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
    });
};