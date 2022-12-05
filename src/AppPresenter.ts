import { injectable } from 'inversify'

@injectable()
export class AppPresenter {
    constructor() { }

    get appName(): string {
        return 'Books & Authors'
    }
}