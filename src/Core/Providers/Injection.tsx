import { Container, interfaces } from 'inversify'
import { createContext, useContext, FC, PropsWithChildren, useState } from 'react'

interface InjectionState {
    container: Container | null
}

export const InjectionContext = createContext<InjectionState>({ container: null })

interface Props {
    container: Container
}

export const InjectionProvider: FC<PropsWithChildren<Props>> = ({ container, children }) => {
    return (
        <InjectionContext.Provider value={{ container }}>
            {children}
        </InjectionContext.Provider>
    )
}

export function useInjection<T>(identifier: interfaces.ServiceIdentifier<T>): T {
    const { container } = useContext(InjectionContext)
    if (!container) {
        throw new Error('IoC container not configured')
    }
    const [dependency] = useState<T>(container.get<T>(identifier))

    return dependency
}