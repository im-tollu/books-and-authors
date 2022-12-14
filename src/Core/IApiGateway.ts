export interface IApiGateway {
    get: (path: string) => Promise<any>
    post: (path: string, requestDto: Object) => Promise<any>
    delete: (path: string) => Promise<any>
}