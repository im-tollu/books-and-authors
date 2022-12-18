import { inject, injectable } from 'inversify'
import { makeObservable, observable } from 'mobx'
import { TYPE } from '../Core/Types'
import type { IRoutingGateway } from './IRoutingGateway'
import { RouteDefinition, routeDefinitions, RouteId } from './RouteDefinitions'

export interface Route {
    id: RouteId
}

const ROUTING_PREFIX = '#!'

@injectable()
export class Router {
    currentRoute: Route

    constructor(
        @inject(TYPE.IRoutingGateway) private _gateway: IRoutingGateway,
    ) {
        this.currentRoute = {
            id: RouteId.LoginRoute
        }

        makeObservable(this, {
            currentRoute: observable
        })

        this._gateway.subscribe(this.onRoute)
    }

    navigate = (routeId: RouteId) => {
        const routeDefinition = routeDefinitions[routeId]
        const pathString = routeDefinition.path.join('/')
        const routingString = `${ROUTING_PREFIX}${pathString}`
        this._gateway.navigate(routingString)
    }

    onRoute = (routingString: string) => {
        console.log('routingString:', routingString)
        const routeId = parseRoute(routingString)
        this.currentRoute.id = routeId
        console.log('route:', this.currentRoute.id.toString())
    }
}

function parseRoute(routingString: string): RouteId {
    if (routingString === '' || routingString === ROUTING_PREFIX) {
        console.log(RouteId.HomeRoute)
        return RouteId.HomeRoute
    }

    if (!routingString.startsWith(ROUTING_PREFIX)) {
        throw new Error(`Invalid routing string prefix: ${routingString}`)
    }
    const strippedRoutingString = routingString.substring(ROUTING_PREFIX.length)

    for (const routeDefinition of routeDefinitions) {
        console.log(`matching ${strippedRoutingString} to ${routeDefinition.path}`)
        if (routingStringMatches(strippedRoutingString, routeDefinition)) {
            console.log(`route matches: ${routeDefinition.routeId}`)
            return routeDefinition.routeId
        }
    }

    console.log(RouteId.NotFoundRoute)
    return RouteId.NotFoundRoute
}


function routingStringMatches(routingString: string, routeDefinition: RouteDefinition): boolean {
    const routingStringParts = routingString.split('/')
    if (routingStringParts.length !== routeDefinition.path.length) {
        return false
    }

    for (let i = 0; i < routeDefinition.path.length; i++) {
        if (routingStringParts[i] !== routeDefinition.path[i]) {
            return false
        }
    }

    return true
}