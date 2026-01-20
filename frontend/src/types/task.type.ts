// USEEd in CreateTasks

import { IconType } from "react-icons/lib"
import { AssignedUser } from "./user.type";
// import { TaskType } from '../features/zodSchemas/admin/createTaskSchema'

// export {TaskType}

export interface ApiResponseType<T> {
    success: boolean;
    data: T;
    message: string
}


export type API_PATHS_TYPE = {
    AUTH: {
        REGISTER: string
        LOGIN: string
        LOGOUT: string
        GET_PROFILE: string
        UPDATE_PROFILE: string
        CHANGE_PASSWORD: string
    }

    USERS: {
        GET_ALL_USERS: string
        GET_USER_BY_ID: (userId: string) => string
        CREATE_USER: string
        UPDATE_USER: (userId: string) => string
        DELETE_USER: (userId: string) => string
    }

    TASKS: {
        GET_ALL_TASKS: string
        CREATE_TASK: string
        GET_TASK_BY_ID: (taskId: string) => string
        UPDATE_TASK: (taskId: string) => string
        TOGGLE_DELETE_TASK: (taskId: string) => string

        UPDATE_TASK_STATUS: (taskId: string) => string
        UPDATE_TASK_TODO_CHECKLIST: (taskId: string) => string
    }

    DASHBOARD: {
        GET_DASHBOARD_DATA: string
        GET_EMPLOYEE_DASHBOARD_DATA: string
    }

    REPORT: {
        EXPORT_TASKS: string
        EXPORT_USERS: string
    }

    IMAGE: {
        UPLOAD_IMAGE: string
    }

    INVITE: {
        GENERATE_INVITE_TOKEN: (token: string) => string
    }
}

export type TaskType = {
    title: string,
    description: string,
    priority: PriorityValueType | '',
    dueTo: Date | string,
    assignedTo: AssignedUser[],
    todoList: TodoType[],
    attachments: string[],
}



// USED in todoListInput
export type TodoType = {
    text: string;
    completed: boolean
}

// USED in priority SelectDropDrown

export type PriorityValueType = 'medium' | 'high' | 'low'

export type PriorityLabelType = "Low" | "Medium" | "High"

export type PriorityOptionsType = {
    value: PriorityValueType,
    label: PriorityLabelType
}
// NOTE: implement typeof keyof OptionsType in value

export interface SelectDropdownProps<T> {
    id?: string
    options: T;
    value: string;
    onChange: (option: string) => void;
    placeholder: string;
    label?: string
}

export type StatusValueType = "pending" | "in-progress" | "completed"
export type StatusLabelType = "Pending" | "In Progress" | "Completed"

export type StatusOptionsType = {
    label: StatusLabelType,
    value: StatusValueType,
}

export type SIDE_MENU_TYPE = {
    id: string,
    label: string,
    icon: IconType,
    path: string,
}

// USED in ManageTasks


export type Tab = {
    label: StatusLabelType | 'All',
    count: number
}

export type ManageTodo = TodoType & { _id: string }

export type ManageTask = Pick<TaskType,
    "title" | "description"
> & {
    _id: string
    priority: PriorityValueType,
    dueTo: Date | string,
    assignedTo: AssignedUser[],
    attachments: string[],
    todoList: ManageTodo[],
    status: StatusValueType
    createdBy: string;
    progress: number
    isDeleted: boolean
    completedTodoCount: number
    createdAt: string
    updatedAt: string
    __v: number
}

export interface TaskStatusSummary {
    allTasks: number
    pendingTasks: number
    inProgressTasks: number
    completedTasks: number
}

export type ManageTasksData = {
    tasks: ManageTask[],
    statusSummary: TaskStatusSummary,
}

// USED in Task Card
export type TaskCardProps = Omit<ManageTask,
    "__v" | "isDeleted" | "updatedAt" | "createdBy" | "attachments"
> & {
    attachmentCount: number
    onClick: () => void,
}