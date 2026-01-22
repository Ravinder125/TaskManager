import { ApiResponse, Pagination, Params, UpdateUserPayload } from "../../types/api.type";
import { AssignedUser, ManageAllUsers, UserType } from "../../types/user.type";
import { API_PATHS } from "../../utils/apiPaths";
import { networkRequest } from "../../utils/networkRequest";

type GetAllUsersResponse = {
    users: ManageAllUsers[],
    pagination: Pagination
}

export const getAllUsersApi = async (params: Params): Promise<ApiResponse<GetAllUsersResponse>> => {
    return await networkRequest<ApiResponse<GetAllUsersResponse>>({
        method: "GET",
        url: API_PATHS.USERS.GET_ALL_USERS,
        params
    });
};


// export const getUserByIdApi = async (
//     userId: string
// ): Promise<ApiResponse<UserType>> => {
//     return await networkRequest<ApiResponse<UserType>>({
//         method: "GET",
//         url: API_PATHS.USERS.GET_USER_BY_ID(userId),
//     });
// };


export const createUserApi = async (
    payload: UserType
): Promise<ApiResponse<UserType>> => {
    return await networkRequest<ApiResponse<UserType>>({
        method: "POST",
        url: API_PATHS.USERS.CREATE_USER,
        data: payload,
    });
};


export const getUserProfileApi = async (): Promise<ApiResponse<UserType>> => {
    return await networkRequest<ApiResponse<UserType>>({
        method: "DELETE",
        url: API_PATHS.AUTH.GET_PROFILE,
    });
};


export const updateUserApi = async (payload: UpdateUserPayload)
    : Promise<ApiResponse<UserType>> => {
    return await networkRequest<ApiResponse<UserType>>({
        method: "PUT",
        url: API_PATHS.AUTH.UPDATE_PROFILE,
        data: payload,
    });
};


export const deleteUserApi = async (
    userId: string
): Promise<ApiResponse<null>> => {
    return await networkRequest<ApiResponse<null>>({
        method: "DELETE",
        url: API_PATHS.USERS.DELETE_USER(userId),
    });
};
