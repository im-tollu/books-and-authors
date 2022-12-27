import { IApiGateway } from "../Core/IApiGateway"
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter"
import { TYPE } from "../Core/Types"
import { IRoutingGateway } from "../Routing/IRoutingGateway"
import { RouteDefinitions, RouteId } from "../Routing/RouteDefinitions"
import { Router } from "../Routing/Router"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetFailedRegistrationStub } from "../TestTools/GetFailedRegistrationStub"
import { GetFailedUserLoginStub } from "../TestTools/GetFailedUserLoginStub"
import { GetSuccessfulRegistrationStub } from "../TestTools/GetSuccessfulRegistrationStub"
import { GetSuccessfulUserLoginStub } from "../TestTools/GetSuccessfulUserLoginStub"
import { mockResolve } from "../TestTools/mockingUtils"
import { AuthenticationRepository } from "./AuthenticationRepository"
import { LoginRegisterOption, LoginRegisterPresenter } from "./LoginRegisterPresenter"
import { UserModel } from "./UserModel"

interface AuthenticationApp {
    loginRegisterPresenter: LoginRegisterPresenter
    authenticationRepository: AuthenticationRepository
    messagesPresenter: MessagesPresenter
    router: Router
    routeDefinitions: RouteDefinitions
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
            routeDefinitions: container.get(RouteDefinitions),
            userModel: container.get(UserModel),
            routingGateway: container.get<IRoutingGateway>(TYPE.IRoutingGateway),
            apiGateway: container.get<IApiGateway>(TYPE.IApiGateway)
        }
    })

    describe('init', () => {
        it('should start with login route', () => {
            const { router } = app!

            expect(router.currentRoute.routeDefinition.routeId)
                .toEqual(RouteId.LoginRoute)
        })
    })

    describe('routing', () => {
        it('should navigate to login route', () => {
            const { router, routeDefinitions } = app!
            router.currentRoute = {
                routeDefinition: routeDefinitions.forRouteId(RouteId.NotFoundRoute)
            }

            router.onRoute('#!login')

            expect(router.currentRoute.routeDefinition.routeId).toEqual(RouteId.LoginRoute)
        })

        it('unauthenticated user accessing private route should be redirected to login route', () => {
            const { router, routingGateway, userModel } = app!

            router.onRoute('')

            expect(routingGateway.navigate).toBeCalledWith('#!login')
            expect(userModel.isLoggedIn).toEqual(false)
        })
    })

    describe('register', () => {
        it('succeeds', async () => {
            const { router, loginRegisterPresenter, userModel, messagesPresenter, apiGateway } = app!
            mockResolve(apiGateway.post, GetSuccessfulRegistrationStub())

            loginRegisterPresenter.option = LoginRegisterOption.Register
            loginRegisterPresenter.email = 'a@b.com'
            loginRegisterPresenter.password = 'p@ssw0rd'

            await loginRegisterPresenter.submitForm()

            expect(apiGateway.post)
                .toBeCalledWith(
                    '/register',
                    {
                        email: 'a@b.com',
                        password: 'p@ssw0rd'
                    }
                )
            expect(userModel.token).toEqual('1234a@b.com')
            expect(userModel.isLoggedIn).toEqual(true)
            expect(apiGateway.setAuthenticationToken).toBeCalledWith('1234a@b.com')
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
            loginRegisterPresenter.email = 'a@b.com'
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
            loginRegisterPresenter.email = 'a@b.com'
            loginRegisterPresenter.password = 'p@ssw0rd'

            await loginRegisterPresenter.submitForm()

            expect(userModel.isLoggedIn).toEqual(false)
            expect(messagesPresenter.errors).toContain('Failed: credentials not valid must be (email and >3 chars on password).')
        })
    })

    describe('login', () => {
        it('should go to home route on success (and populate UserModel)', async () => {
            const { loginRegisterPresenter, userModel, messagesPresenter, apiGateway, routingGateway } = app!
            mockResolve(apiGateway.post, GetSuccessfulUserLoginStub())

            loginRegisterPresenter.option = LoginRegisterOption.Login
            loginRegisterPresenter.email = 'a@b.com'
            loginRegisterPresenter.password = 'p@ssw0rd'

            await loginRegisterPresenter.submitForm()

            expect(apiGateway.post)
                .toBeCalledWith(
                    '/login',
                    {
                        email: 'a@b.com',
                        password: 'p@ssw0rd'
                    }
                )
            expect(userModel.token).toEqual('1234a@b.com')
            expect(userModel.isLoggedIn).toEqual(true)
            expect(routingGateway.navigate).toBeCalledWith('#!')
            expect(apiGateway.setAuthenticationToken).toBeCalledWith('1234a@b.com')
        })

        it('should not leave login route on failed login', async () => {
            const { loginRegisterPresenter, userModel, messagesPresenter, apiGateway, routingGateway } = app!
            mockResolve(apiGateway.post, GetFailedUserLoginStub())

            loginRegisterPresenter.option = LoginRegisterOption.Login
            loginRegisterPresenter.email = 'a@b.com'
            loginRegisterPresenter.password = 'p@ssw0rd'

            await loginRegisterPresenter.submitForm()

            expect(userModel.isLoggedIn).toEqual(false)
            expect(messagesPresenter.errors).toContain('Failed: no user record.')
            expect(routingGateway.navigate).not.toBeCalled()
        })
    })

    describe('logout', () => {
        it('should logout', async () => {
            const { router, routeDefinitions, loginRegisterPresenter, userModel, apiGateway, routingGateway } = app!
            userModel.token = '1234a@b.com'
            router.currentRoute = {
                routeDefinition: routeDefinitions.forRouteId(RouteId.HomeRoute)
            }

            await loginRegisterPresenter.logOut()

            expect(userModel.token).toBeNull()
            expect(userModel.isLoggedIn).toEqual(false)
            expect(apiGateway.setAuthenticationToken).toBeCalledWith(null)
            expect(routingGateway.navigate).toBeCalledWith('#!login')
        })
    })
})