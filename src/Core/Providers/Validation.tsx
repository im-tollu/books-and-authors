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