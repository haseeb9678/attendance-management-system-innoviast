import { RESEND_FROM_EMAIL } from "../../../config/env.js";
import { resend } from "./resend.client.js";
import type { SendEmailOptions } from "./email.types.js";

if (!RESEND_FROM_EMAIL) {
    throw new Error("RESEND_FROM_EMAIL is missing");
}

export const sendEmail = async ({
    to,
    subject,
    html,
    text,
}: SendEmailOptions): Promise<void> => {


    const response = await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to,
        subject,
        html,
        text,
    });



    if (response.error) {
        console.error("❌ Resend email error:", response.error);
        throw new Error(
            response.error.message || "Failed to send email via Resend"
        );
    }

};