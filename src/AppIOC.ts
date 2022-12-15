import { Container } from 'inversify'
import { HttpGateway } from './Core/HttpGateway'
import { IApiGateway } from './Core/IApiGateway'
import { MessagesRepository } from './Core/Messages/MessagesRepository'
import { TYPE } from './Core/Types'
import { Router } from './Routing/Router'

export const container = new Container({
    autoBindInjectable: true,
    defaultScope: 'Transient'
})

container.bind<IApiGateway>(TYPE.IApiGateway).to(HttpGateway)
container.bind<Router>(Router).toSelf().inSingletonScope()
container.bind<MessagesRepository>(MessagesRepository).toSelf().inSingletonScope()