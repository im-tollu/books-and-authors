import { } from 'jest'
import { UserModel } from '../Authentication/UserModel'
import { RouteId } from './RouteDefinitions'
import { Router } from './Router'
import { initTestApp } from '../TestTools/AppTestHarness'
import { IRoutingGateway } from './IRoutingGateway'
import { TYPE } from '../Core/Types'

describe('Router', () => {
    it('subscribes to route changes', () => {
        const app = initTestApp()
        const router = app.get(Router)
        const routingGateway = app.get<IRoutingGateway>(TYPE.IRoutingGateway)

        expect(routingGateway.subscribe).toBeCalledWith(router.onRoute)
    })

    it('authenticated user can navigate to target route', () => {
        const app = initTestApp()
        const userModel = app.get(UserModel)
        const router = app.get(Router)

        userModel.token = 'authToken'
        router.onRoute('#!')

        expect(router.currentRoute.routeId).toBe(RouteId.HomeRoute)
    })

    it('user is redirected to not-found route when provided unknown path', () => {
        const app = initTestApp()
        const router = app.get(Router)
        const routingGateway = app.get<IRoutingGateway>(TYPE.IRoutingGateway)

        router.onRoute('#!unknown-route')

        expect(routingGateway.navigate).toBeCalledWith('#!not-found')
    })
})