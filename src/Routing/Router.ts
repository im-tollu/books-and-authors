import { inject, injectable } from 'inversify'
import { makeObservable, observable } from 'mobx'
import { UserModel } from '../Authentication/UserModel'
import { TYPE } from '../Core/Types'
import type { IRoutingGateway } from './IRoutingGateway'
import { RouteDefinition, routeDefinitions, RouteId } from './RouteDefinitions'

export interface Route {
    routeId: RouteId
}

const ROUTING_PREFIX = '#!'

@injectable()
export class Router {
    currentRoute: Route

    constructor(
        @inject(TYPE.IRoutingGateway) private _gateway: IRoutingGateway,
        @inject(UserModel) private _userModel: UserModel,
    ) {
        this.currentRoute = {
            routeId: RouteId.LoginRoute
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
        console.log(`navigating to ${routingString}`)
        this._gateway.navigate(routingString)
    }

    onRoute = (routingString: string) => {
        const routeId = parseRoute(routingString)
        const routeDefinition = routeDefinitions.find(route => route.routeId === routeId)!
        if (routeDefinition.isSecure && !this._userModel.isLoggedIn) {
            this.navigate(RouteId.LoginRoute)
            return
        }

        this.currentRoute = {
            routeId
        }
    }
}

function parseRoute(routingString: string): RouteId {
    if (routingString === '' || routingString === ROUTING_PREFIX) {
        return RouteId.HomeRoute
    }

    if (!routingString.startsWith(ROUTING_PREFIX)) {
        throw new Error(`Invalid routing string prefix: ${routingString}`)
    }
    const strippedRoutingString = routingString.substring(ROUTING_PREFIX.length)

    for (const routeDefinition of routeDefinitions) {
        if (routingStringMatches(strippedRoutingString, routeDefinition)) {
            return routeDefinition.routeId
        }
    }

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