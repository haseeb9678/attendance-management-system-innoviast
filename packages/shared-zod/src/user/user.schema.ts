import { z } from "zod";

const selectOptionSchema = z.object({
    label: z.string(),
    value: z.string(),
});

export const userSchema = z
    .object({
        // Personal Information
        name: z
            .string()
            .trim()
            .min(3, "Name must be at least 3 characters"),

        email: z
            .email("Invalid email address"),

        phoneNumber: z
            .string()
            .min(11, "Phone number must be 11 digits")
            .max(11, "Phone number must be 11 digits"),

        // Account Information
        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),

        // Role Information
        role: selectOptionSchema,

        status: selectOptionSchema,

        // =========================
        // Student Fields
        // =========================
        registrationNumber: z.string().optional(),

        rollNumber: z.string().optional(),

        department: selectOptionSchema.optional(),

        class: selectOptionSchema.optional(),

        // =========================
        // Instructor Fields
        // =========================
        employeeId: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // Password Match
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords do not match",
            });
        }

        // Student Validation
        if (data.role.value === "student") {
            if (!data.registrationNumber?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    path: ["registrationNumber"],
                    message: "Registration number is required",
                });
            }

            if (!data.rollNumber?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    path: ["rollNumber"],
                    message: "Roll number is required",
                });
            }

            if (!data.department) {
                ctx.addIssue({
                    code: "custom",
                    path: ["department"],
                    message: "Department is required",
                });
            }

            if (!data.class) {
                ctx.addIssue({
                    code: "custom",
                    path: ["class"],
                    message: "Class is required",
                });
            }
        }

        // Instructor Validation
        if (data.role.value === "instructor") {
            if (!data.employeeId?.trim()) {
                ctx.addIssue({
                    code: "custom",
                    path: ["employeeId"],
                    message: "Employee ID is required",
                });
            }

            if (!data.department) {
                ctx.addIssue({
                    code: "custom",
                    path: ["department"],
                    message: "Department is required",
                });
            }
        }
    });

export type UserSchema = z.infer<typeof userSchema>;