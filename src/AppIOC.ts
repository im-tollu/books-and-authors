import { Container, ContainerModule, interfaces } from 'inversify'
import { HttpGateway } from './Core/HttpGateway'
import { IApiGateway } from './Core/IApiGateway'
import { MessagesRepository } from './Core/Messages/MessagesRepository'
import { TYPE } from './Core/Types'
import { Router } from './Routing/Router'

export function createContainer(gateways: ContainerModule = productionGateways): Container {
    const container = new Container({
        autoBindInjectable: true,
        defaultScope: 'Transient'
    })
    container.load(core, gateways)

    return container
}

const core = new ContainerModule(
    (bind: interfaces.Bind) => {
        bind<Router>(Router).toSelf().inSingletonScope()
        bind<MessagesRepository>(MessagesRepository).toSelf().inSingletonScope()
    }
)

const productionGateways = new ContainerModule(
    (bind: interfaces.Bind) => {
        bind<IApiGateway>(TYPE.IApiGateway).to(HttpGateway)
    }
)


