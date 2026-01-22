import { ManageTask } from "./task.type";
import { UserFullName } from "./user.type";



export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface UseNetworkProps<D> {
    data?: D;
    url: string;
    method: HttpMethod
}


// src/types/api.type.ts
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


export interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export interface GetTasksResponse {
    tasks: ManageTask[];
    statusSummary: {
        allTasks: number;
        pendingTasks: number;
        inProgressTasks: number;
        completedTasks: number;
    };
    pagination: Pagination
}

export interface Params {
    search?: string,
    status?: string,
    page: number,
    limit: number
}

export interface UpdateUserPayload {
    fullName: UserFullName,
    email: string,
    profileImageUrl?: string | undefined,
}