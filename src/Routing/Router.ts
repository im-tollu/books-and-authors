import { inject, injectable } from 'inversify'
import { makeObservable, observable } from 'mobx'
import { UserModel } from '../Authentication/UserModel'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'
import { TYPE } from '../Core/Types'
import type { IRoutingGateway } from './IRoutingGateway'
import { RouteDefinition, RouteDefinitions, RouteId } from './RouteDefinitions'

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
        @inject(MessagesPresenter) private _messages: MessagesPresenter,
        @inject(RouteDefinitions) private _routeDefinitions: RouteDefinitions
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
        console.log('RouteId:', routeId)
        const routeDefinition = this._routeDefinitions.forRouteId(routeId)
        console.log('Route definition:', JSON.stringify(routeDefinition, null, 2))
        const pathString = routeDefinition.path.join('/')
        const routingString = `${ROUTING_PREFIX}${pathString}`
        console.log(`navigating to ${routingString}`)
        this._messages.reset()
        this._gateway.navigate(routingString)
    }

    onRoute = (routingString: string) => {
        const routeId = this.parseRoute(routingString)
        if (routeId === null) {
            this.navigate(RouteId.NotFoundRoute)
            return
        }

        const routeDefinition = this._routeDefinitions.forRouteId(routeId)!
        if (routeDefinition.isSecure && !this._userModel.isLoggedIn) {
            this.navigate(RouteId.LoginRoute)
            return
        }

        this.currentRoute = {
            routeId
        }
    }

    private parseRoute = (routingString: string): RouteId | null => {
        if (routingString === '' || routingString === ROUTING_PREFIX) {
            return RouteId.HomeRoute
        }

        if (!routingString.startsWith(ROUTING_PREFIX)) {
            throw new Error(`Invalid routing string prefix: ${routingString}`)
        }

        const strippedRoutingString = routingString.substring(ROUTING_PREFIX.length)
        for (const routeDefinition of this._routeDefinitions.definitions) {
            if (routingStringMatches(strippedRoutingString, routeDefinition)) {
                return routeDefinition.routeId
            }
        }

        return null
    }
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