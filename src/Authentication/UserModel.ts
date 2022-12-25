import { injectable } from 'inversify'
import { computed, makeObservable, observable } from 'mobx'

@injectable()
export class UserModel {
    token: string | null

    constructor() {
        makeObservable(this, {
            token: observable,
            isLoggedIn: computed,
        })

        this.token = null
    }

    get isLoggedIn() {
        return this.token !== null
    }
}
