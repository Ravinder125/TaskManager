import z from "zod";
// import { AssignedUser } from '../../../types/userTypes'

export const createTaskSchema = z.object({
    title: z
        .string()
        .nonempty({ message: "Title is required" })
        .min(3, { message: "Title must be at least 3 characters long" }),

    description: z
        .string()
        .nonempty({ message: "Description is required" })
        .min(3, { message: "Description must be at least 3 characters long" }),

    priority: z.enum(["medium", "high", "low"], {
        required_error: "Priority is required", message: "Priority is required"
    }),

    dueTo: z
        .preprocess((arg) => (typeof arg === "string" || arg instanceof Date) ? new Date(arg) : arg, z.date({
            required_error: "Due date is required", message: "Due Date is required"
        }))
        .refine((date) => !isNaN(date.getTime()), {
            message: "Invalid due date",
        }),

    assignedTo: z
        .array(z.string(), {
            required_error: "Task is not assigned to anyone yet",
        })
        .nonempty("Task is not assigned to anyone yet"),

    todoList: z
        .array(z.object({
            text: z
                .string()
                .nonempty({ message: "Todo title is required" }),
            completed: z.boolean({ message: "Completed should be boolean" })
        }), {
            required_error: "Todo list is required",
        })
        .nonempty("Add at least one todo"),

    attachments: z.array(z.string()),
});

export const fullNameSchema = z.object({
    firstName: z
        .string()
        .nonempty({ message: "Firs name is required" }),

    lastName: z
        .string()
        .optional()
}, { message: "Name is required" })

export const assignedUserSchema = z.object({
    _id: z
        .string()
        .nonempty({ message: "ID is required" }),

    email: z
        .string()
        .email({ message: "Invalid email" })
        .nonempty({ message: "Email is required" }),

    profileImageUrl: z
        .string()
        .optional(),

    fullName: fullNameSchema
});

export type TaskType = z.infer<typeof createTaskSchema>;
export type AssignedUser = z.infer<typeof assignedUserSchema>; 