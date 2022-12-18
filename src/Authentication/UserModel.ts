import { injectable } from 'inversify'
import { computed, makeObservable, observable } from 'mobx'

@injectable()
export class UserModel {
    email: string | null

    token: string | null

    constructor() {
        makeObservable(this, {
            email: observable,
            token: observable,
            isLoggedIn: computed,
        })

        this.email = null
        this.token = null
    }

    get isLoggedIn() {
        console.log(`token: ${this.token}`)
        return this.token !== null
    }
}
