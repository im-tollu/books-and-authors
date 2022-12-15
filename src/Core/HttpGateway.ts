import { injectable, inject } from 'inversify'
import { UserModel } from '../Authentication/UserModel'
import { Config } from './Config'
import { IApiGateway } from './IApiGateway'

@injectable()
export class HttpGateway implements IApiGateway {
    constructor(
        @inject(Config) private _config: Config,
        @inject(UserModel) private _userModel: UserModel
    ) { }

    get = async (path: string) => {
        const response = await fetch(this.resolvePath(path), {
            method: 'GET',
            headers: this.buildHeaders()
        })
        const dto = await response.json()
        return dto
    }

    post = async (path: string, requestDto: Object) => {
        const response = await fetch(this.resolvePath(path), {
            method: 'POST',
            body: JSON.stringify(requestDto),
            headers: this.buildHeaders()
        })
        const dto = await response.json()
        console.log('dto', dto)
        return dto
    }

    delete = async (path: string) => {
        const response = await fetch(this.resolvePath(path), {
            method: 'DELETE',
            headers: this.buildHeaders()
        })
        const dto = await response.json()
        return dto
    }

    resolvePath = (path: string) => {
        return this._config.secureApiUrl + path
    }

    buildHeaders = () => {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        }

        if (this._userModel.token !== null) {
            headers['Authorization'] = this._userModel.token
        }

        return headers
    }
}
