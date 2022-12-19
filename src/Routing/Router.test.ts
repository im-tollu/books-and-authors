import { Container } from 'inversify'
import { } from 'jest'
import 'reflect-metadata'
import { createContainer, Gateways } from '../AppIOC'
import { UserModel } from '../Authentication/UserModel'
import { IApiGateway } from '../Core/IApiGateway'
import { IRoutingGateway } from './IRoutingGateway'
import { RouteId } from './RouteDefinitions'
import { Router } from './Router'


export interface TestHarness {
    gateways: Gateways,
    container: Container
}

function init(): TestHarness {
    const apiGateway: IApiGateway = {
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    }
    const routingGateway: IRoutingGateway = {
        subscribe: jest.fn(),
        navigate: jest.fn(),
    }
    const gateways: Gateways = {
        apiGateway,
        routingGateway,
    }
    const container = createContainer(gateways)

    return {
        gateways,
        container,
    }
}

describe('Router', () => {
    it('unauthenticated user is redirected to login route', () => {
        const { gateways, container } = init()

        const router = container.get(Router)
        expect(gateways.routingGateway.subscribe).toBeCalledWith(router.onRoute)

        router.onRoute('#!')
        expect(gateways.routingGateway.navigate).toBeCalledWith('#!login')
        expect(router.currentRoute.routeId).toBe(RouteId.LoginRoute)
    })

    it('authenticated user can navigate to target route', () => {
        const { container } = init()

        const userModel = container.get(UserModel)
        userModel.token = 'authToken'
        const router = container.get(Router)

        router.onRoute('#!')
        expect(router.currentRoute.routeId).toBe(RouteId.HomeRoute)
    })

    it('user is redirected to not-found route when provided unknown path', () => {
        const { gateways, container } = init()

        const router = container.get(Router)

        router.onRoute('#!unknown-route')
        expect(gateways.routingGateway.navigate).toBeCalledWith('#!not-found')
    })
})