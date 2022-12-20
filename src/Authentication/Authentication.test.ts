import { Type } from "ajv/dist/compile/util"
import { Container } from "inversify"
import { IApiGateway } from "../Core/IApiGateway"
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter"
import { TYPE } from "../Core/Types"
import { IRoutingGateway } from "../Routing/IRoutingGateway"
import { RouteId } from "../Routing/RouteDefinitions"
import { Router } from "../Routing/Router"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetSuccessfulRegistrationStub } from "../TestTools/GetSuccessfulRegistrationStub"
import { mockResolve } from "../TestTools/mockingUtils"
import { AuthenticationRepository } from "./AuthenticationRepository"
import { LoginRegisterOption, LoginRegisterPresenter } from "./LoginRegisterPresenter"
import { UserModel } from "./UserModel"

interface AuthenticationApp {
    loginRegisterPresenter: LoginRegisterPresenter
    authenticationRepository: AuthenticationRepository
    messagesPresenter: MessagesPresenter
    router: Router
    userModel: UserModel
    routingGateway: IRoutingGateway
    apiGateway: IApiGateway
}

describe('authentication', () => {
    let app: AuthenticationApp | null = null

    beforeEach(() => {
        const container = initTestApp()
        app = {
            loginRegisterPresenter: container.get(LoginRegisterPresenter),
            authenticationRepository: container.get(AuthenticationRepository),
            messagesPresenter: container.get(MessagesPresenter),
            router: container.get(Router),
            userModel: container.get(UserModel),
            routingGateway: container.get<IRoutingGateway>(TYPE.IRoutingGateway),
            apiGateway: container.get<IApiGateway>(TYPE.IApiGateway)
        }
    })

    describe('init', () => {
        it('unauthenticated user is redirected from home route to login route', () => {
            const { router, routingGateway, userModel } = app!

            router.onRoute('#!')

            expect(routingGateway.navigate).toBeCalledWith('#!login')
            expect(router.currentRoute.routeId).toBe(RouteId.LoginRoute)
            expect(userModel.isLoggedIn).toEqual(false)
        })
    })

    describe('routing', () => {

    })

    describe('register', () => {
        it('succeeds', async () => {
            const { router, loginRegisterPresenter, userModel, messagesPresenter, apiGateway } = app!
            mockResolve(apiGateway.post, GetSuccessfulRegistrationStub())

            router.onRoute('#!login')
            expect(router.currentRoute.routeId).toBe(RouteId.LoginRoute)

            loginRegisterPresenter.option = LoginRegisterOption.Register
            loginRegisterPresenter.email = 'joe@example.org'
            loginRegisterPresenter.password = 'p@ssw0rd'
            await loginRegisterPresenter.submitForm()

            expect(apiGateway.post)
                .toBeCalledWith(
                    '/register',
                    {
                        email: 'joe@example.org',
                        password: 'p@ssw0rd'
                    }
                )
            expect(userModel.token).toEqual('a@b1234.com')
            expect(userModel.isLoggedIn).toEqual(true)
            expect(messagesPresenter.successes).toEqual(['Success: Limited to one test account per trainee!'])
        })

        it('no e-mail provided', async () => {

        })
    })

    describe('login', () => {

    })

    describe('logout', () => {

    })
})