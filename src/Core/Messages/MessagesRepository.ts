import { injectable } from 'inversify'
import { action, makeObservable, observable } from 'mobx'

export enum MessageLevel {
    Success,
    Warning,
    Error
}


export interface Message {
    message: string
    level: MessageLevel
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

    addError = (message: string) => {
        this.addMessage({
            message,
            level: MessageLevel.Error
        })
    }

    addWarning = (message: string) => {
        this.addMessage({
            message,
            level: MessageLevel.Warning
        })
    }

    addSuccess = (message: string) => {
        this.addMessage({
            message,
            level: MessageLevel.Success
        })
    }
}
