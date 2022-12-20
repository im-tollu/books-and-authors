import { Type } from "ajv/dist/compile/util"
import { Container } from "inversify"
import { IApiGateway } from "../Core/IApiGateway"
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter"
import { TYPE } from "../Core/Types"
import { IRoutingGateway } from "../Routing/IRoutingGateway"
import { RouteId } from "../Routing/RouteDefinitions"
import { Router } from "../Routing/Router"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetFailedRegistrationStub } from "../TestTools/GetFailedRegistrationStub"
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
        it('unauthenticated user should start at login route', () => {
            const { router, routingGateway, userModel } = app!

            router.onRoute('')

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
            expect(messagesPresenter.successes).toContain('Success: Limited to one test account per trainee!')
        })

        it('no e-mail provided', async () => {
            const { loginRegisterPresenter, messagesPresenter, userModel, apiGateway } = app!

            loginRegisterPresenter.option = LoginRegisterOption.Register
            loginRegisterPresenter.email = ''
            loginRegisterPresenter.password = 'p@ssw0rd'
            await loginRegisterPresenter.submitForm()

            expect(apiGateway.post).not.toBeCalled()
            expect(userModel.isLoggedIn).toEqual(false)
            expect(messagesPresenter.warnings).toContain('No email')
        })

        it('no password provided', async () => {
            const { loginRegisterPresenter, messagesPresenter, userModel, apiGateway } = app!

            loginRegisterPresenter.option = LoginRegisterOption.Register
            loginRegisterPresenter.email = 'joe@example.org'
            loginRegisterPresenter.password = ''
            await loginRegisterPresenter.submitForm()

            expect(apiGateway.post).not.toBeCalled()
            expect(userModel.isLoggedIn).toEqual(false)
            expect(messagesPresenter.warnings).toContain('No password')
        })

        it('invalid credentials sent to API', async () => {
            const { loginRegisterPresenter, userModel, messagesPresenter, apiGateway } = app!
            mockResolve(apiGateway.post, GetFailedRegistrationStub())

            loginRegisterPresenter.option = LoginRegisterOption.Register
            loginRegisterPresenter.email = 'joe@example.org'
            loginRegisterPresenter.password = 'p@ssw0rd'
            await loginRegisterPresenter.submitForm()

            expect(userModel.isLoggedIn).toEqual(false)
            expect(messagesPresenter.errors).toContain('Failed: credentials not valid must be (email and >3 chars on password).')
        })
    })

    describe('login', () => {
        it.todo('should go to home route on success (and populate UserModel)')

        it.todo('should not leave login route on failed login')

        it.todo('should clear messages on route change')
    })

    describe('logout', () => {
        it('should logout', async () => {
            const { router, loginRegisterPresenter, userModel, routingGateway } = app!
            userModel.token = 'a@b1234.com'
            router.currentRoute = {
                routeId: RouteId.HomeRoute
            }

            await loginRegisterPresenter.logOut()

            expect(userModel.token).toBeNull()
            expect(userModel.isLoggedIn).toEqual(false)
            expect(routingGateway.navigate).toBeCalledWith('#!login')
        })
    })
})