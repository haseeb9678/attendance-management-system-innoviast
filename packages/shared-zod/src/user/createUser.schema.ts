import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createUserSchema = z
    .object({
        // Personal Information
        name: z
            .string()
            .trim()
            .min(3, "Name must be at least 3 characters")
            .max(100, "Name must not exceed 100 characters"),

        email: z
            .email("Invalid email address"),

        phoneNumber: z
            .string()
            .trim()
            .regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),

        // Account Information
        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        // Role Information
        role: z.enum(["admin", "instructor", "student"], {
            error: "Please provide a valid role.",
        }),

        status: z.enum(["active", "inactive"], {
            error: "Please provide a valid status.",
        }),

        // =========================
        // Student Fields
        // =========================
        registrationNumber: z.string().trim().optional(),

        rollNumber: z.string().trim().optional(),

        department: z
            .string()
            .trim()
            .regex(objectIdRegex, "Invalid department ID")
            .optional(),

        class: z
            .string()
            .trim()
            .regex(objectIdRegex, "Invalid class ID")
            .optional(),

        // =========================
        // Instructor Fields
        // =========================
        employeeId: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.role === "student") {
            if (!data.registrationNumber) {
                ctx.addIssue({
                    code: "custom",
                    path: ["registrationNumber"],
                    message: "Registration number is required",
                });
            }

            if (!data.rollNumber) {
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

        if (data.role === "instructor") {
            if (!data.employeeId) {
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

export type CreateUserInput = z.infer<typeof createUserSchema>;