class ApiResponse<T = unknown> {
    public success: boolean;

    constructor(
        public statusCode: number,
        public message: string = "Success",
        public data: T,
        public meta: unknown = null
    ) {
        this.success =
            statusCode >= 200 &&
            statusCode < 300;
    }
}

export default ApiResponse;