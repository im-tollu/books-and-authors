import { inject, injectable } from "inversify";
import { BooksRepository } from "../Books/BooksRepository";

export enum RouteId {
    LoginRoute = 'LoginRoute',
    HomeRoute = 'HomeRoute',
    BooksRoute = 'BooksRoute',
    AuthorsRoute = 'AuthorsRoute',
    NotFoundRoute = 'NotFoundRoute',
}

export interface RouteDefinition {
    routeId: RouteId
    path: string[]
    isSecure: boolean
    onEnter?: () => void
    onLeave?: () => void
}

@injectable()
export class RouteDefinitions {
    constructor(
        @inject(BooksRepository) private _booksRepository: BooksRepository
    ) {
    }

    get definitions(): RouteDefinition[] {
        return [
            {
                routeId: RouteId.LoginRoute,
                path: ['login'],
                isSecure: false,
            },
            {
                routeId: RouteId.HomeRoute,
                path: [],
                isSecure: true,
            },
            {
                routeId: RouteId.BooksRoute,
                path: ['books'],
                isSecure: true,
                onEnter: () => {
                    console.log('Entering books')
                    this._booksRepository.load()
                },
                onLeave: () => {
                    console.log('Resetting books')
                    this._booksRepository.reset()
                }
            },
            {
                routeId: RouteId.NotFoundRoute,
                path: ['not-found'],
                isSecure: false,
            }
        ]
    }

    forRouteId(routeId: RouteId): RouteDefinition {
        return this.definitions
            .find(routeDefinition => routeDefinition.routeId === routeId)!
    }
}
