import { Container } from 'inversify'
import { Router } from './Routing/Router'

export const container = new Container({
    autoBindInjectable: true,
    defaultScope: 'Transient'
})

container.bind<Router>(Router).toSelf().inSingletonScope()