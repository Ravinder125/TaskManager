import { Types } from "mongoose";

export type TaskStatus = "completed" | "pending" | "in-progress";
export type TaskPriority = "high" | "medium" | "low";

export interface ITodo {
    text: string;
    completed: boolean;
}

export interface ITask {
    title: string;
    description: string;
    todoList: ITodo[];
    assignedTo: Types.ObjectId[];
    createdBy: Types.ObjectId;
    attachments?: string[];
    dueTo?: Date;
    completedAt?: Date;
    status: TaskStatus;
    progress: number;
    priority: TaskPriority;
    isDeleted: boolean;
}