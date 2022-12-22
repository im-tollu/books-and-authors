import { } from 'jest'
import { UserModel } from '../Authentication/UserModel'
import { RouteDefinitions, RouteId } from './RouteDefinitions'
import { Router } from './Router'
import { initTestApp } from '../TestTools/AppTestHarness'
import { IRoutingGateway } from './IRoutingGateway'
import { TYPE } from '../Core/Types'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

interface RouterApp {
    router: Router
    messagesPresenter: MessagesPresenter
    userModel: UserModel
    routingGateway: IRoutingGateway
}

describe('Router', () => {
    let app: RouterApp | null = null

    beforeEach(() => {
        const container = initTestApp()
        app = {
            router: container.get(Router),
            messagesPresenter: container.get(MessagesPresenter),
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

        expect(router.currentRoute.routeDefinition.routeId).toBe(RouteId.HomeRoute)
    })

    it('user is redirected to not-found route when provided unknown path', () => {
        const { router, routingGateway } = app!

        router.onRoute('#!unknown-route')

        expect(routingGateway.navigate).toBeCalledWith('#!not-found')
    })

    it('should clear messages when navigating', async () => {
        const { router, messagesPresenter } = app!
        messagesPresenter.addError('Some error')
        messagesPresenter.addWarning('Some warning')
        messagesPresenter.addSuccess('Success')

        router.navigate(RouteId.HomeRoute)

        expect(messagesPresenter.hasMessages).toEqual(false)
        expect(messagesPresenter.errors).toEqual([])
        expect(messagesPresenter.warnings).toEqual([])
        expect(messagesPresenter.successes).toEqual([])
    })
})