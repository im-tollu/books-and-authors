interface ApiResponse {
    success: boolean
    result: object
}

export interface ErrorResult {
    message: string
}

export interface IApiGateway {
    getPublic: (path: string) => Promise<ApiResponse>
    get: (path: string) => Promise<ApiResponse>
    post: (path: string, requestDto: Object) => Promise<ApiResponse>
    delete: (path: string) => Promise<ApiResponse>
    setAuthenticationToken: (token: string | null) => void
}