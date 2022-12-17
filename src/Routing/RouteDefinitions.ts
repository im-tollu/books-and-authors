export enum RouteId {
    LoginRoute,
    HomeRoute,
}

interface RouteDefinition {
    path: string[]
}

export const routeDefinitions: Record<RouteId, RouteDefinition> = {
    [RouteId.LoginRoute]: {
        path: ['login']
    },
    [RouteId.HomeRoute]: {
        path: []
    },
}
