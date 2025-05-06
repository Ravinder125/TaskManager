// utils/ApiResponse.js

export class ApiResponse {
    constructor(status, message, data = null,) {
        this.success = status >= 200 && status < 300;
        this.status = status;
        this.message = message;
        this.data = this.success ? data : null;
    }

    static success(status, data, message = 'Success') {
        return new ApiResponse(status, message, data);
    }

    static error(status, message) {
        return new ApiResponse(status, message, null);
    }
}
