import { Container } from 'inversify'
import { ClientValidation } from './Core/Providers/Validation'
import { Router } from './Routing/Router'

export const container = new Container({
    autoBindInjectable: true,
    defaultScope: 'Transient'
})

container.bind<Router>(Router).toSelf().inSingletonScope()
container.bind<ClientValidation>(ClientValidation).toSelf().inSingletonScope()