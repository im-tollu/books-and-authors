import { injectable } from 'inversify'
import { computed, makeObservable, observable } from 'mobx'

@injectable()
export class UserModel {
    email: string | null = null
    token: string | null = null =

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
