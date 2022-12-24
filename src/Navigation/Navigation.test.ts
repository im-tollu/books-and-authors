import { UserModel } from "../Authentication/UserModel"
import { TYPE } from "../Core/Types"
import { IRoutingGateway } from "../Routing/IRoutingGateway"
import { RouteId } from "../Routing/RouteDefinitions"
import { Router } from "../Routing/Router"
import { initTestApp } from "../TestTools/AppTestHarness"
import { NavigationPresenter } from "./NavigationPresenter"

interface NavigationApp {
    navigationPresenter: NavigationPresenter
    router: Router
    userModel: UserModel
    routingGateway: IRoutingGateway
}

describe('navigation', () => {
    let app: NavigationApp | null = null

    beforeEach(() => {
        const container = initTestApp()
        app = {
            navigationPresenter: container.get(NavigationPresenter),
            router: container.get(Router),
            userModel: container.get(UserModel),
            routingGateway: container.get<IRoutingGateway>(TYPE.IRoutingGateway),
        }
    })

    it('should navigate down the navigation tree', () => {
        const { navigationPresenter, userModel, router, routingGateway } = app!
        userModel.token = 'token'

        // start at Home
        router.onRoute('#!')
        expect(navigationPresenter.viewModel).toEqual({
            showBack: false,
            currentSelectedVisibleName: 'Home > HomeRoute',
            currentSelectedBackTarget: { visible: false, routeId: null },
            menuItems: [
                {
                    'routeId': RouteId.BooksRoute,
                    'visibleName': 'Books',
                },
                {
                    'routeId': RouteId.AuthorsRoute,
                    'visibleName': 'Authors',
                }
            ]
        })

        // navigate to Authors
        navigationPresenter.goToId(RouteId.AuthorsRoute)
        expect(routingGateway.navigate).toBeCalledWith('#!authors')

        router.onRoute('#!authors')
        expect(navigationPresenter.viewModel).toEqual({
            showBack: true,
            currentSelectedVisibleName: 'Authors > AuthorsRoute',
            currentSelectedBackTarget: { visible: true, routeId: RouteId.HomeRoute },
            menuItems: [
                {
                    'routeId': RouteId.AuthorsRoute_AuthorPolicyRoute,
                    'visibleName': 'Author Policy',
                },
                {
                    'routeId': RouteId.AuthorsRoute_MapRoute,
                    'visibleName': 'View Map',
                }
            ]
        })

        // navigate to Authors Policy
        navigationPresenter.goToId(RouteId.AuthorsRoute_AuthorPolicyRoute)
        expect(routingGateway.navigate).toBeCalledWith('#!authors/policy')

        router.onRoute('#!authors/policy')
        expect(navigationPresenter.viewModel).toEqual({
            showBack: true,
            currentSelectedVisibleName: 'Author Policy > AuthorsRoute_AuthorPolicyRoute',
            currentSelectedBackTarget: { visible: true, routeId: RouteId.AuthorsRoute },
            menuItems: []
        })

    })

    it('should move back twice', () => {
        const { navigationPresenter, userModel, router, routingGateway } = app!
        userModel.token = 'token'

        // start at Authors Policy
        router.onRoute('#!authors/policy')
        navigationPresenter.back()

        expect(routingGateway.navigate).toBeCalledWith('#!authors')

        // back to Authors
        router.onRoute('#!authors')
        navigationPresenter.back()

        expect(routingGateway.navigate).toBeCalledWith('#!')
    })
})