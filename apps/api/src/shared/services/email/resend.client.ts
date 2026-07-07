import { Resend } from "resend";
import { RESEND_API_KEY } from "../../../config/env.js";

if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing");
}

export const resend = new Resend(RESEND_API_KEY);