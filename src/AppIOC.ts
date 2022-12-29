import { Container } from 'inversify'
import { UserModel } from './Authentication/UserModel'
import { AuthorsPresenter } from './Authors/AuthorsPresenter'
import { AuthorsRepository } from './Authors/AuthorsRepository'
import { BooksRepository } from './Books/BooksRepository'
import { Config } from './Core/Config'
import { HttpGateway } from './Core/HttpGateway'
import { IApiGateway } from './Core/IApiGateway'
import { MessagesRepository } from './Core/Messages/MessagesRepository'
import { TYPE } from './Core/Types'
import { BrowserRoutingGateway } from './Routing/BrowserRoutingGateway'
import { IRoutingGateway } from './Routing/IRoutingGateway'
import { Router } from './Routing/Router'

export interface Gateways {
    apiGateway: IApiGateway
    routingGateway: IRoutingGateway
}

export function createContainer(gateways: Gateways = productionGateways): Container {
    const container = new Container({
        autoBindInjectable: true,
        defaultScope: 'Transient'
    })
    container.bind<Router>(Router).toSelf().inSingletonScope()
    container.bind<MessagesRepository>(MessagesRepository).toSelf().inSingletonScope()
    container.bind<UserModel>(UserModel).toSelf().inSingletonScope()
    container.bind<BooksRepository>(BooksRepository).toSelf().inSingletonScope()
    container.bind<AuthorsRepository>(AuthorsRepository).toSelf().inSingletonScope()
    container.bind<AuthorsPresenter>(AuthorsPresenter).toSelf().inSingletonScope()

    container.bind<IApiGateway>(TYPE.IApiGateway).toConstantValue(gateways.apiGateway)
    container.bind<IRoutingGateway>(TYPE.IRoutingGateway).toConstantValue(gateways.routingGateway)
    return container
}

const config = new Config()

const productionGateways: Gateways = {
    apiGateway: new HttpGateway(config),
    routingGateway: new BrowserRoutingGateway()
}
