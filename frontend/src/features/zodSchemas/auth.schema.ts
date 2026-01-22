import z from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .nonempty({ message: "Enter your full name" })
        .min(3, { message: "Full name must be at least 3 characters long" }),
    email: z
        .string()
        .nonempty({ message: "Email is required" })
        .email({ message: "Invalid email" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    role: z
        .enum(["admin", "employee"]).default("employee")
});

export const loginSchema = z.object({
    email: z
        .string()
        .nonempty({ message: "Email is required" })
        .email({ message: "Invalid email" }),
    password: z
        .string()
        .nonempty({ message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
})