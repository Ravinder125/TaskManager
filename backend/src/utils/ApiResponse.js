// utils/ApiResponse.js

export class ApiResponse {
    constructor(status, message, data = null, error = null) {
        this.success = status >= 200 && status < 300;
        this.status = status;
        this.message = message;
        this.data = this.success ? data : null;
        this.error = this.success ? null : Array.isArray(error) ? error : [error];
    }

    static success(status, data, message = 'Success') {
        return new ApiResponse(status, message, data);
    }

    static error(status, error, message = 'Error') {
        return new ApiResponse(status, message, null, error);
    }
}
