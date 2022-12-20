import { Container } from "inversify"
import { createContainer, Gateways } from "../AppIOC"
import { IApiGateway } from "../Core/IApiGateway"
import { IRoutingGateway } from "../Routing/IRoutingGateway"

export const initTestApp = (): Container => {
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

    return createContainer(gateways)
}