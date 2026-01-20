import { ApiResponse } from "../../types/api.type";
import { API_PATHS } from "../../utils/apiPaths";
import { DashboardData } from '../../types/dashboard.type'
import { networkRequest } from "../../utils/networkRequest";

export const getDashboardData = async (): Promise<ApiResponse<DashboardData>> => {
    return await networkRequest<ApiResponse<DashboardData>>({
        method: "GET",
        url: API_PATHS.DASHBOARD.GET_DASHBOARD_DATA,
    });
};

export const getEmployeeDashboardData = async (): Promise<ApiResponse<DashboardData>> => {
    return await networkRequest<ApiResponse<DashboardData>>({
        method: "GET",
        url: API_PATHS.DASHBOARD.GET_EMPLOYEE_DASHBOARD_DATA,
    });
};
