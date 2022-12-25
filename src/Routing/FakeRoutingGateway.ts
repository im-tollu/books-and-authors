import { IRoutingGateway, RoutingHandler } from "./IRoutingGateway";

export class FakeRoutingGateway implements IRoutingGateway {
    private _handler: RoutingHandler | null = null
    subscribe = jest.fn(handler => {
        this._handler = handler
    })

    navigate = jest.fn(routingString => {
        if (this._handler !== null) {
            this._handler(routingString)
        }
    })
}