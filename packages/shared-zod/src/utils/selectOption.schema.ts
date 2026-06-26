import z from "zod";

export const selectOptionSchema = (name: string) =>
    z.object(
        {
            label: z.string(),
            value: z.string().trim().min(1),
        },
        {
            error: `Please select a ${name.toLowerCase()}`,
        }
    );