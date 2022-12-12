import { inject, injectable } from "inversify";
import { Router } from "../Routing/Router";

export enum LoginRegisterOption {
    Login,
    Register
}

@injectable()
export class LoginRegisterPresenter {
    option: LoginRegisterOption
    email: string
    password: string

    constructor(
        @inject(Router) private router: Router
    ) {
        this.email = ''
        this.password = ''
        this.option = LoginRegisterOption.Login
    }

    reset = () => {
        this.email = ''
        this.password = ''
        this.option = LoginRegisterOption.Login
    }

    login = async () => { }

    register = async () => { }
}