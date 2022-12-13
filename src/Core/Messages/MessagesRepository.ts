import { injectable, inject } from 'inversify'
import { makeObservable, observable } from 'mobx'

@injectable()
export class MessagesRepository {
    appMessages: string[]

    constructor() {
        makeObservable(this, {
            appMessages: observable
        })
        this.appMessages = []
    }

    reset = () => {
        this.appMessages = []
    }
}
