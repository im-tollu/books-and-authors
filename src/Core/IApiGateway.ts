interface ApiResponse {
    success: boolean
    result: object
}

export interface IApiGateway {
    get: (path: string) => Promise<ApiResponse>
    post: (path: string, requestDto: Object) => Promise<ApiResponse>
    delete: (path: string) => Promise<ApiResponse>
}