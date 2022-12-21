export enum RouteId {
    LoginRoute = 'LoginRoute',
    HomeRoute = 'HomeRoute',
    BooksRoute = 'BooksRoute',
    AuthorsRoute = 'AuthorsRoute',
    NotFoundRoute = 'NotFoundRoute',
}

export interface RouteDefinition {
    routeId: RouteId,
    path: string[],
    isSecure: boolean,
}

export const routeDefinitions: RouteDefinition[] = [
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
        routeId: RouteId.NotFoundRoute,
        path: ['not-found'],
        isSecure: false,
    }
]
