import { Config } from './Config'
import { IApiGateway } from './IApiGateway'

export class HttpGateway implements IApiGateway {
    _authenticationToken: string | null = '1234a@b.com'

    constructor(private _config: Config) { }


    setAuthenticationToken(token: string | null) {
        this._authenticationToken = token
    }

    getPublic = async (path: string) => {
        const response = await fetch(this.resolvePath(path, true), {
            method: 'GET',
            headers: this.buildHeaders()
        })
        const dto = await response.json()
        return dto
    }

    get = async (path: string) => {
        const response = await fetch(this.resolvePath(path, false), {
            method: 'GET',
            headers: this.buildHeaders()
        })
        const dto = await response.json()
        return dto
    }

    post = async (path: string, requestDto: Object) => {
        const response = await fetch(this.resolvePath(path, false), {
            method: 'POST',
            body: JSON.stringify(requestDto),
            headers: this.buildHeaders()
        })
        const dto = await response.json()
        console.log('dto', dto)
        return dto
    }

    delete = async (path: string) => {
        const response = await fetch(this.resolvePath(path, false), {
            method: 'DELETE',
            headers: this.buildHeaders()
        })
        const dto = await response.json()
        return dto
    }

    resolvePath = (path: string, isPublic: boolean) => {
        if (isPublic) {
            return this._config.publicApiUrl + path
        }
        return this._config.secureApiUrl + path
    }

    buildHeaders = () => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        }

        if (this._authenticationToken !== null) {
            headers['Authorization'] = this._authenticationToken
        }

        return headers
    }
}
