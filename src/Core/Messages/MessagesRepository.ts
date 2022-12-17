import { injectable } from 'inversify'
import { action, makeObservable, observable } from 'mobx'

export enum MessageSource {
    Api,
    Ui
}


export interface Message {
    message: string
    source: MessageSource
}

@injectable()
export class MessagesRepository {
    messages: Message[]

    constructor() {
        makeObservable(this, {
            messages: observable,
            addMessage: action,
            reset: action
        })
        this.messages = []
    }

    addMessage = (message: Message) => {
        this.messages.push(message)
    }

    reset = () => {
        this.messages = []
    }
}
