import { inject, injectable } from "inversify";
import { makeObservable, observable } from "mobx";
import { ClientValidation } from "../Core/Providers/Validation";
import { Router } from "../Routing/Router";

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
        @inject(Router) private router: Router,
        @inject(ClientValidation) private clientValidation: ClientValidation
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
        this.validateForm()
        if (this.clientValidation.hasMessages) {
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
        console.log(`email: [${this.email}]`)
        if (this.email === '') {
            this.clientValidation.addMessage('No email')
        }

        console.log(`password: [${this.password}]`)
        if (this.password === '') {
            this.clientValidation.addMessage('No password')
        }
    }

    login = async () => {
        console.log('Logging in...')
    }

    register = async () => {
        console.log('Registering...')
    }
}