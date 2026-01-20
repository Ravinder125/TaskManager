import { ZodSchema } from "zod"

export function validateFields<T>(data: T, schema: ZodSchema): {
    message: string,
    success: boolean,
    data: T | null,
} {
    const result = schema.safeParse(data)
    if (result.success) return { success: true, data: result.data, message: "Payload is valid" }

    const fieldErrors = result.error.errors
    return { message: fieldErrors[0].message, success: false, data: null }

}