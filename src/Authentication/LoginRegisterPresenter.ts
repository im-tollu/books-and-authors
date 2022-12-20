import { inject, injectable } from "inversify";
import { makeObservable, observable } from "mobx";
import type { IApiGateway } from "../Core/IApiGateway";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";
import { TYPE } from "../Core/Types";
import { Router } from "../Routing/Router";
import { AuthenticationRepository } from "./AuthenticationRepository";

export enum LoginRegisterOption {
    Login = 'Login',
    Register = 'Register'
}

@injectable()
export class LoginRegisterPresenter {
    option: LoginRegisterOption
    email: string
    password: string

    constructor(
        @inject(Router) private _router: Router,
        @inject(TYPE.IApiGateway) private _apiGateway: IApiGateway,
        @inject(AuthenticationRepository) private _authenticationRepository: AuthenticationRepository,
        @inject(MessagesPresenter) private _messagePresenter: MessagesPresenter
    ) {
        this.email = ''
        this.password = ''
        this.option = LoginRegisterOption.Login

        makeObservable(this, {
            option: observable,
            email: observable,
            password: observable
        })
    }

    reset = () => {
        this.email = ''
        this.password = ''
        this.option = LoginRegisterOption.Login
    }

    submitForm = async () => {
        this._messagePresenter.reset()
        this.validateForm()
        if (this._messagePresenter.hasMessages) {
            return
        }

        if (this.option === LoginRegisterOption.Login) {
            await this.login()
        }
        if (this.option === LoginRegisterOption.Register) {
            await this.register()
        }
    }

    validateForm = () => {
        if (this.email === '') {
            this._messagePresenter.addUiMessage('No email')
        }

        if (this.password === '') {
            this._messagePresenter.addUiMessage('No password')
        }
    }

    login = async () => {
        console.log('Logging in...')
        await this._authenticationRepository.login(this.email, this.password)
    }

    register = async () => {
        console.log('Registering...')
        await this._authenticationRepository.register(this.email, this.password)
    }

    logOut = async () => {
        console.log('Logging out...')
        await this._authenticationRepository.logOut()
    }
}