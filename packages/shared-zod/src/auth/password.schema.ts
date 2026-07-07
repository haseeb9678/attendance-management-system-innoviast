import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z
        .email("Invalid email address"),
});

export const verifyResetTokenSchema = z.object({
    token: z
        .string()
        .trim()
        .min(1, "Reset token is required"),
});

export const resetPasswordSchema = z
    .object({
        token: z
            .string()
            .trim()
            .min(1, "Reset token is required"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z
            .string(),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords do not match",
            });
        }
    });

export type ForgotPasswordInput = z.infer<
    typeof forgotPasswordSchema
>;

export type ResetPasswordInput = z.infer<
    typeof resetPasswordSchema
>;