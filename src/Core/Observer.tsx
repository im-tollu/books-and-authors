import { observer } from "mobx-react-lite";

export function namedObserver<T>(displayName: string, component: React.FC<T>) {
    const observerComponent = observer(component)
    observerComponent.displayName = displayName
    return observerComponent
}