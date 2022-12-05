import { injectable } from 'inversify'
import { makeObservable, observable } from 'mobx'
import { RouteId } from './RouteDefinitions'

export interface Route {
    id: RouteId
}

@injectable()
export class Router {
    currentRoute: Route

    constructor() {
        this.currentRoute = {
            id: RouteId.LoginRoute
        }

        makeObservable(this, {
            currentRoute: observable
        })
    }
}