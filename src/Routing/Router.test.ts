import { } from 'jest'
import { UserModel } from '../Authentication/UserModel'
import { RouteId } from './RouteDefinitions'
import { Router } from './Router'
import { initTestApp } from '../TestTools/AppTestHarness'
import { IRoutingGateway } from './IRoutingGateway'
import { TYPE } from '../Core/Types'

interface RouterApp {
    router: Router
    userModel: UserModel
    routingGateway: IRoutingGateway
}

describe('Router', () => {
    let app: RouterApp | null = null

    beforeEach(() => {
        const container = initTestApp()
        app = {
            router: container.get(Router),
            userModel: container.get(UserModel),
            routingGateway: container.get<IRoutingGateway>(TYPE.IRoutingGateway),
        }
    })

    it('subscribes to route changes', () => {
        const { router, routingGateway } = app!

        expect(routingGateway.subscribe).toBeCalledWith(router.onRoute)
    })

    it('authenticated user can navigate to target route', () => {
        const { router, userModel } = app!

        userModel.token = 'authToken'
        router.onRoute('#!')

        expect(router.currentRoute.routeId).toBe(RouteId.HomeRoute)
    })

    it('user is redirected to not-found route when provided unknown path', () => {
        const { router, routingGateway } = app!

        router.onRoute('#!unknown-route')

        expect(routingGateway.navigate).toBeCalledWith('#!not-found')
    })
})