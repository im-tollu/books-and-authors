import { injectable, inject } from 'inversify'
import { makeObservable, action, computed } from 'mobx'
import { MessageLevel, MessagesRepository } from './MessagesRepository'

@injectable()
export class MessagesPresenter {

    constructor(
        @inject(MessagesRepository) private _messagesRepository: MessagesRepository
    ) {
        makeObservable(this, {
            errors: computed,
            warnings: computed,
            successes: computed,
            hasMessages: computed,
            reset: action,
        })
    }

    get errors(): string[] {
        return this.getMessagesOfLevel(MessageLevel.Error)
    }

    get warnings(): string[] {
        return this.getMessagesOfLevel(MessageLevel.Warning)
    }

    get successes(): string[] {
        return this.getMessagesOfLevel(MessageLevel.Success)
    }

    get hasMessages() {
        return this._messagesRepository.messages.length > 0
    }

    addError = this._messagesRepository.addError

    addWarning = this._messagesRepository.addWarning

    addSuccess = this._messagesRepository.addSuccess

    getMessagesOfLevel = (level: MessageLevel): string[] => {
        return this._messagesRepository.messages
            .filter(message => message.level === level)
            .map(message => message.message)
    }

    reset = () => {
        this._messagesRepository.reset()
    }
}
