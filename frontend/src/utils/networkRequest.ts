import { AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";

// utils/networkRequest.ts
export async function networkRequest<TResponse>(
    config: AxiosRequestConfig
): Promise<TResponse> {
    const res = await axiosInstance(config);
    return res.data;
}
