import {
    ManageTask,
    PriorityLabelType,
    PriorityValueType,
    StatusLabelType,
    StatusValueType
} from "./task.type"

export interface DashboardStatistics {
    totalTasks: number
    pendingTasks: number
    inProgressTasks: number
    completedTasks: number
    overDueTasks: number
}

export interface TaskDistributionChart {
    pending: number
    inProgress: number
    completed: number
    all?: number
}

export interface TaskPriorityChart {
    low: number
    medium: number
    high: number
}

export interface DashboardCharts {
    taskDistribution: TaskDistributionChart
    taskPriorityLevels: TaskPriorityChart
}

export interface RecentTask {
    _id: string
    title: string
    dueTo: string
    status: StatusValueType
    priority: PriorityValueType
    createdAt: string
}

export interface DashboardData {
    statistics: DashboardStatistics
    charts: DashboardCharts
    recentTasks: RecentTask[]
}

export type DistributionData = {
    status: StatusLabelType,
    count: number
}

export type PriorityLevelData = {
    priority: PriorityLabelType,
    count: number
}

export type TableData = Pick<ManageTask, "title" | "status" | "priority" | "createdAt">

export interface TaskListTableProps {
    tableData: TableData[]
}