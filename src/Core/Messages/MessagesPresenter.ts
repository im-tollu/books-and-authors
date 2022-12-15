import { injectable, inject } from 'inversify'
import { makeObservable, action, computed } from 'mobx'
import { MessageSource, MessagesRepository } from './MessagesRepository'

@injectable()
export class MessagesPresenter {

    constructor(
        @inject(MessagesRepository) private _messagesRepository: MessagesRepository
    ) {
        makeObservable(this, {
            apiMessages: computed,
            uiMessages: computed,
            hasMessages: computed,
            reset: action,
        })
    }

    get apiMessages(): string[] {
        return this.getMessagesOfSource(MessageSource.Api)
    }

    get uiMessages(): string[] {
        return this.getMessagesOfSource(MessageSource.Ui)
    }

    get hasMessages() {
        return this._messagesRepository.messages.length > 0
    }

    addUiMessage = (message: string) => {
        this._messagesRepository.addMessage({
            message,
            source: MessageSource.Ui
        })
    }

    addApiMessage = (message: string) => {
        this._messagesRepository.addMessage({
            message,
            source: MessageSource.Api
        })
    }

    getMessagesOfSource = (source: MessageSource): string[] => {
        return this._messagesRepository.messages
            .filter(message => message.source === source)
            .map(message => message.message)
    }

    reset = () => {
        this._messagesRepository.reset()
    }
}
