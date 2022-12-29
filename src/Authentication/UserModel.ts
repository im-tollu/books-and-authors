import { injectable } from 'inversify'
import { computed, makeObservable, observable } from 'mobx'

@injectable()
export class UserModel {
    email: string | null = null //'a@b.com'
    token: string | null = null //'1234a@b.com'

    constructor() {
        makeObservable(this, {
            token: observable,
            isLoggedIn: computed,
        })
    }

    get isLoggedIn() {
        return this.token !== null && this.email !== null
    }
}
