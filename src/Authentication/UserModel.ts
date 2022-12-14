import { injectable } from 'inversify'
import { makeObservable, observable } from 'mobx'

@injectable()
export class UserModel {
    email: string | null

    token: string | null

    constructor() {
        makeObservable(this, {
            email: observable,
            token: observable
        })

        this.email = null
        this.token = null
    }
}
