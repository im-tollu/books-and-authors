import { Container } from "inversify"
import { createContainer, Gateways } from "../AppIOC"
import { IApiGateway } from "../Core/IApiGateway"
import { FakeRoutingGateway } from "../Routing/FakeRoutingGateway"
import { IRoutingGateway, RoutingHandler } from "../Routing/IRoutingGateway"

export const initTestApp = (): Container => {
    const apiGateway: IApiGateway = {
        getPublic: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
        setAuthenticationToken: jest.fn()
    }

    const routingGateway: IRoutingGateway = new FakeRoutingGateway()

    const gateways: Gateways = {
        apiGateway,
        routingGateway,
    }

    return createContainer(gateways)
}