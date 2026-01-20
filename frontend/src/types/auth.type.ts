export type RoleValue = "admin" | "employee"
export type RoleLabel = "Admin" | "Employee"

export type RegisterFormData = {
    fullName: string,
    email: string,
    password: string,
    role: RoleValue | ""
}
export type RoleOptions = {
    value: RoleValue,
    label: RoleLabel
}