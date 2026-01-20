import { AxiosResponse } from "axios";
import axiosInstance from "../utils/axiosInstance"
import { UseNetworkProps } from "../types/api.type";




export default async function useNetwork<D, T>({
    data,
    url,
    // method
}: UseNetworkProps<D>): Promise<AxiosResponse<T>> {
    const response = await axiosInstance.request<T>({
        url,
        data,
    });
    return response;
}


