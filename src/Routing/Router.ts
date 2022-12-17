import { inject, injectable } from 'inversify'
import { makeObservable, observable } from 'mobx'
import { TYPE } from '../Core/Types'
import type { IRoutingGateway } from './IRoutingGateway'
import { routeDefinitions, RouteId } from './RouteDefinitions'

export interface Route {
    id: RouteId
}

@injectable()
export class Router {
    currentRoute: Route

    constructor(
        @inject(TYPE.IRoutingGateway) private _gateway: IRoutingGateway,
    ) {
        this._gateway.subscribe(this.onRoute)

        this.currentRoute = {
            id: RouteId.LoginRoute
        }

        makeObservable(this, {
            currentRoute: observable
        })


    }

    navigate = (routeId: RouteId) => {
        const routeDefinition = routeDefinitions[routeId]
        const pathString = routeDefinition.path.join('/')
        const routingString = `!/${pathString}`
        this._gateway.navigate(routingString)
    }

    onRoute = (routingString: string) => {
        console.log('routingString:', routingString)
    }
}