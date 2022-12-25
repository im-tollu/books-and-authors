export type RoutingHandler = (routingString: string) => void

export interface IRoutingGateway {
    subscribe: (handler: RoutingHandler) => void
    navigate: (routingString: string) => void
}