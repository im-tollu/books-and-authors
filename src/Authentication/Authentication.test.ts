import { RouteId } from "../Routing/RouteDefinitions"
import { Router } from "../Routing/Router"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetSuccessfulRegistrationStub } from "../TestTools/GetSuccessfulRegistrationStub"
import { LoginRegisterOption, LoginRegisterPresenter } from "./LoginRegisterPresenter"
import { UserModel } from "./UserModel"

describe('authentication', () => {
    describe('init', () => {
        it('unauthenticated user is redirected from home route to login route', () => {
            const { gateways, container } = initTestApp()
            const router = container.get(Router)
            const userModel = container.get(UserModel)

            router.onRoute('#!')
            expect(gateways.routingGateway.navigate).toBeCalledWith('#!login')
            expect(router.currentRoute.routeId).toBe(RouteId.LoginRoute)
            expect(userModel.isLoggedIn).toEqual(false)
        })
    })

    describe('routing', () => {

    })

    describe('register', () => {
        const { gateways, container } = initTestApp()
        const router = container.get(Router)
        const presenter = container.get(LoginRegisterPresenter)
        const userModel = container.get(UserModel)

        it('succeeds', async () => {
            (gateways.apiGateway.post as jest.Mock)
                .mockResolvedValue(GetSuccessfulRegistrationStub())
            router.onRoute('#!login')
            expect(router.currentRoute.routeId).toBe(RouteId.LoginRoute)

            presenter.option = LoginRegisterOption.Register
            presenter.email = 'joe@example.org'
            presenter.password = 'p@ssw0rd'
            await presenter.submitForm()

            expect(gateways.apiGateway.post)
                .toBeCalledWith(
                    '/register',
                    {
                        email: 'joe@example.org',
                        password: 'p@ssw0rd'
                    }
                )
            expect(userModel.token).toEqual('a@b1234.com')
            expect(userModel.isLoggedIn).toEqual(true)
        })
    })

    describe('login', () => {

    })

    describe('logout', () => {

    })
})