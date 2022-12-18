import { inject, injectable } from 'inversify'
import { RouteId } from './Routing/RouteDefinitions'
import { Router } from './Routing/Router'

@injectable()
export class AppPresenter {

    constructor(
        @inject(Router) private router: Router
    ) { }

    get appName(): string {
        return 'Books & Authors'
    }

    get currentRouteId(): RouteId {
        return this.router.currentRoute.routeId
    }
}