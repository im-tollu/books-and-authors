import { injectable, inject } from 'inversify'
import { makeObservable, observable, action, computed } from 'mobx'
import { ClientValidation } from '../Providers/Validation'
import { MessagesRepository } from './MessagesRepository'

@injectable()
export class MessagesPresenter {
    showValidationWarning: boolean

    constructor(
        @inject(ClientValidation) private _clientValidation: ClientValidation,
        @inject(MessagesRepository) private _messagesRepository: MessagesRepository
    ) {
        makeObservable(this, {
            showValidationWarning: observable,
            messages: computed,
            uiMessages: computed,
            hasUiMessages: computed,
            unpackRepositoryPmToVm: action
        })
        this.showValidationWarning = false
    }

    get messages() {
        return this._messagesRepository.appMessages
    }

    get uiMessages() {
        return this._clientValidation.messages
    }

    get hasUiMessages() {
        return this._clientValidation.hasMessages
    }

    unpackRepositoryPmToVm = (pm: any, userMessage: any) => {
        this.showValidationWarning = !pm.success
        this._messagesRepository.appMessages = pm.success ? [userMessage] : [pm.serverMessage]
    }
}
