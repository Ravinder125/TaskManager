// utils/ApiResponse.js

export class ApiResponse<T = unknown> {
    status: number;
    success: boolean;
    message: string;
    data: T | null

    constructor(
        status: number,
        message: string,
        data: T | null = null,
    ) {
        this.success = status >= 200 && status < 300;
        this.status = status;
        this.message = message;
        this.data = this.success ? data : null;
    }

    static success<T>(
        status: number,
        data: T,
        message: string = 'Success'
    ) {
        return new ApiResponse(status, message, data);
    }

    static error(status: number, message: string) {
        return new ApiResponse(status, message, null);
    }
}
