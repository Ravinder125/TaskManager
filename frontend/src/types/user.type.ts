import { UpdateUserPayload } from "./api.type";

export interface UserFullName {
    firstName: string
    lastName?: string
}

export type UserType = {
    // createdAt: Date;
    // updatedAt: Date;
    role: "admin" | "employee";
    email: string;
    fullName: UserFullName;
    profileImageUrl: string | undefined;
}

export type UserContextType = {
    user: UserType | null,
    loading: boolean,
    error: string | null,
    updateUser: (user: UserType) => void,
    clearUser: Function,
    isAuthenticated: boolean,
}

export type AssignedUser = {
    fullName: UserFullName,
    _id?: string,
    email: string,
    profileImageUrl?: string

}

export interface UserTaskSummary extends AssignedUser {
    pendingTasks: number
    inProgressTasks: number
    completedTasks: number
}

export interface SelectUsersProps {
    selectedUsers: AssignedUser[],
    setSelectedUsers: React.Dispatch<
        React.SetStateAction<AssignedUser[]>
    >;
}

export interface ManageAllUsers extends UserTaskSummary, AssignedUser {
}
