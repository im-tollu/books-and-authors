import { timeStamp } from "console"
import { injectable } from "inversify"
import { action, computed, makeObservable, observable } from "mobx"
import { createContext, PropsWithChildren, useContext, useState } from "react"

interface ValidationState {
    clientValidationMessages: string[]
    updateClientValidationMessages: (clientValidationMessages: string[]) => void
}

const ValidationContext = createContext<ValidationState>({
    clientValidationMessages: [],
    updateClientValidationMessages: () => { }
})

export const ValidationProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [clientValidationMessages, updateClientValidationMessages] = useState<string[]>([])

    return (
        <ValidationContext.Provider value={{ clientValidationMessages, updateClientValidationMessages }}>
            {children}
        </ValidationContext.Provider>
    )
}

export function useValidation() {
    const { clientValidationMessages, updateClientValidationMessages } = useContext(ValidationContext)
    return [clientValidationMessages, updateClientValidationMessages]
}

@injectable()
export class ClientValidation {
    messages: string[]

    constructor() {
        this.messages = []

        makeObservable(this, {
            messages: observable,
            addMessage: action,
            reset: action,
        })
    }

    addMessage = (message: string) => {
        this.messages.push(message)
    }

    reset = () => {
        this.messages = []
    }

    get hasMessages() {
        return this.messages.length !== 0
    }
}