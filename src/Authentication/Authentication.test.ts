import { Type } from "ajv/dist/compile/util"
import { IApiGateway } from "../Core/IApiGateway"
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter"
import { TYPE } from "../Core/Types"
import { IRoutingGateway } from "../Routing/IRoutingGateway"
import { RouteId } from "../Routing/RouteDefinitions"
import { Router } from "../Routing/Router"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetSuccessfulRegistrationStub } from "../TestTools/GetSuccessfulRegistrationStub"
import { mockResolve } from "../TestTools/mockingUtils"
import { LoginRegisterOption, LoginRegisterPresenter } from "./LoginRegisterPresenter"
import { UserModel } from "./UserModel"

describe('authentication', () => {
    describe('init', () => {
        it('unauthenticated user is redirected from home route to login route', () => {
            const app = initTestApp()
            const router = app.get(Router)
            const userModel = app.get(UserModel)
            const routingGateway = app.get<IRoutingGateway>(TYPE.IRoutingGateway)

            router.onRoute('#!')
            expect(routingGateway.navigate).toBeCalledWith('#!login')
            expect(router.currentRoute.routeId).toBe(RouteId.LoginRoute)
            expect(userModel.isLoggedIn).toEqual(false)
        })
    })

    describe('routing', () => {

    })

    describe('register', () => {
        const app = initTestApp()
        const router = app.get(Router)
        const presenter = app.get(LoginRegisterPresenter)
        const userModel = app.get(UserModel)
        const messagesPresenter = app.get(MessagesPresenter)
        const apiGateway = app.get<IApiGateway>(TYPE.IApiGateway)

        it('succeeds', async () => {
            mockResolve(apiGateway.post, GetSuccessfulRegistrationStub())
            router.onRoute('#!login')
            expect(router.currentRoute.routeId).toBe(RouteId.LoginRoute)

            presenter.option = LoginRegisterOption.Register
            presenter.email = 'joe@example.org'
            presenter.password = 'p@ssw0rd'
            await presenter.submitForm()

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