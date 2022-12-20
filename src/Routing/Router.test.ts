import { } from 'jest'
import 'reflect-metadata'
import { UserModel } from '../Authentication/UserModel'
import { RouteId } from './RouteDefinitions'
import { Router } from './Router'
import { initTestApp, TestHarness } from '../TestTools/AppTestHarness'

describe('Router', () => {
    it('unauthenticated user is redirected to login route', () => {
        const { gateways, container } = initTestApp()
        const router = container.get(Router)
        expect(gateways.routingGateway.subscribe).toBeCalledWith(router.onRoute)

        router.onRoute('#!')
        expect(gateways.routingGateway.navigate).toBeCalledWith('#!login')
        expect(router.currentRoute.routeId).toBe(RouteId.LoginRoute)
    })

    it('authenticated user can navigate to target route', () => {
        const { container } = initTestApp()

        const userModel = container.get(UserModel)
        userModel.token = 'authToken'
        const router = container.get(Router)

        router.onRoute('#!')
        expect(router.currentRoute.routeId).toBe(RouteId.HomeRoute)
    })

    it('user is redirected to not-found route when provided unknown path', () => {
        const { gateways, container } = initTestApp()

        const router = container.get(Router)

        router.onRoute('#!unknown-route')
        expect(gateways.routingGateway.navigate).toBeCalledWith('#!not-found')
    })
})