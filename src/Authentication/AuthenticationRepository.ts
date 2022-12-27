import { injectable, inject } from 'inversify'
import { makeObservable, action } from 'mobx'
import { Router } from '../Routing/Router'
import { UserModel } from '../Authentication/UserModel'
import { TYPE } from '../Core/Types'
import type { IApiGateway } from '../Core/IApiGateway'
import { MessagesRepository } from '../Core/Messages/MessagesRepository'
import { RouteId } from '../Routing/RouteDefinitions'

interface LoginDto {
    email: string
    token: string
}

interface RegisterDto {
    email: string
    token: string
    message: string
}

export interface ApiMessage {
    message: string
}

@injectable()
export class AuthenticationRepository {
    constructor(
        @inject(Router) private _router: Router,
        @inject(TYPE.IApiGateway) private _apiGateway: IApiGateway,
        @inject(UserModel) private _userModel: UserModel,
        @inject(MessagesRepository) private _messagesRepository: MessagesRepository
    ) {
        makeObservable(this, {
            login: action
        })
    }

    login = async (email: string, password: string) => {
        const responseDto = await this._apiGateway.post('/login', {
            email: email,
            password: password
        })

        if (responseDto.success) {
            const loginDto = responseDto.result as LoginDto
            this._userModel.email = loginDto.email
            this._userModel.token = loginDto.token
            this._apiGateway.setAuthenticationToken(loginDto.token)
            this._router.navigate(RouteId.HomeRoute)
        } else {
            const messageDto = responseDto.result as ApiMessage
            this._messagesRepository.addError(messageDto.message)
        }
    }

    register = async (email: string, password: string) => {
        const responseDto = await this._apiGateway.post('/register', {
            email: email,
            password: password
        })

        if (responseDto.success) {
            const registerDto = responseDto.result as RegisterDto
            this._userModel.email = registerDto.email
            this._userModel.token = registerDto.token
            this._apiGateway.setAuthenticationToken(registerDto.token)
            this._messagesRepository.addSuccess(registerDto.message)
        } else {
            const messageDto = responseDto.result as ApiMessage
            this._messagesRepository.addError(messageDto.message)
        }
    }

    logOut = async () => {
        this._userModel.email = null
        this._userModel.token = null
        this._apiGateway.setAuthenticationToken(null)
        this._router.navigate(RouteId.LoginRoute)
    }
}
