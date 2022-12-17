import { RouteId } from "./RouteDefinitions";

export interface IRoutingGateway {
    subscribe: (handler: (routingString: string) => void) => void
    navigate: (routingString: string) => void
}