import { z } from "zod";

export const updatePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .trim()
            .min(
                1,
                "Current password is required"
            ),

        newPassword: z
            .string()
            .trim()
            .min(
                8,
                "New password must be at least 8 characters"
            ),

        confirmPassword: z
            .string()
            .trim()
            .min(
                1,
                "Confirm password is required"
            ),
    })
    .superRefine((data, ctx) => {
        if (
            data.currentPassword ===
            data.newPassword
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["newPassword"],
                message:
                    "New password must be different from the current password",
            });
        }

        if (
            data.newPassword !==
            data.confirmPassword
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message:
                    "Passwords do not match",
            });
        }
    });

export type UpdatePasswordInput =
    z.infer<typeof updatePasswordSchema>;