
import { ApiResponse } from "../../types/api.type";
import { ManageTask, TaskType } from "../../types/task.type";
import { API_PATHS } from "../../utils/apiPaths";
import { networkRequest } from "../../utils/networkRequest";


export const createTaskApi = async (
    payload: TaskType
): Promise<ApiResponse<TaskType>> => {
    return await networkRequest<ApiResponse<TaskType>>({
        method: "POST",
        url: API_PATHS.TASKS.CREATE_TASK,
        data: payload,
    });
};


export interface GetTasksResponse {
    tasks: ManageTask[];
    statusSummary: {
        allTasks: number;
        pendingTasks: number;
        inProgressTasks: number;
        completedTasks: number;
    };
}

export const getTasksApi = async (params?: {
    status?: string;
    search?: string;
}): Promise<ApiResponse<GetTasksResponse>> => {
    return await networkRequest<ApiResponse<GetTasksResponse>>({
        method: "GET",
        url: API_PATHS.TASKS.GET_ALL_TASKS,
        params,
    });
};

export const getTaskByIdApi = async (
    taskId: string
): Promise<ApiResponse<ManageTask>> => {
    return await networkRequest<ApiResponse<ManageTask>>({
        method: "GET",
        url: API_PATHS.TASKS.GET_TASK_BY_ID(taskId),
    });
};


export const updateTaskApi = async (
    taskId: string,
    payload: TaskType
): Promise<ApiResponse<TaskType>> => {
    return await networkRequest<ApiResponse<TaskType>>({
        method: "PUT",
        url: API_PATHS.TASKS.UPDATE_TASK(taskId),
        data: payload,
    });
};


/* ================= DELETE ================= */



export const toggleDeleteTaskApi = async (
    taskId: string
): Promise<any> => {
    return await networkRequest({
        method: "PATCH",
        url: API_PATHS.TASKS.TOGGLE_DELETE_TASK(taskId),
    });
};
