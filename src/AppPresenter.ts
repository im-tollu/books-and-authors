import { inject, injectable } from 'inversify'
import { Router } from './Routing/Router'

@injectable()
export class AppPresenter {

    constructor(
        @inject(Router) private router: Router
    ) { }

    get appName(): string {
        return 'Books & Authors'
    }

    get currentRouteId(): string {
        return this.router.currentRoute.id.toString()
    }
}