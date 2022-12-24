import { inject, injectable } from 'inversify'
import { Node } from 'tree-model'
import { computed, makeObservable } from 'mobx'
import { NavigationNode, NavigationRepository } from '../Navigation/NavigationRepository'
import { RouteId } from '../Routing/RouteDefinitions'
import { Router } from '../Routing/Router'

interface BackTarget {
    visible: boolean
    routeId: RouteId | null
}

interface MenuItem {
    routeId: RouteId
    visibleName: string
}

interface Menu {
    showBack: boolean
    currentSelectedVisibleName: string
    currentSelectedBackTarget: BackTarget
    menuItems: MenuItem[]
}

@injectable()
export class NavigationPresenter {
    constructor(
        @inject(NavigationRepository) private _navigationRepository: NavigationRepository,
        @inject(Router) private _router: Router,
    ) {
        makeObservable(this, {
            viewModel: computed
        })
    }

    get viewModel(): Menu {
        const vm: Menu = {
            showBack: false,
            currentSelectedVisibleName: '',
            currentSelectedBackTarget: { visible: false, routeId: null },
            menuItems: [
                {
                    routeId: RouteId.HomeRoute,
                    visibleName: 'Home'
                }
            ]
        }

        let currentNode = this._navigationRepository.currentNode

        if (currentNode) {
            vm.currentSelectedVisibleName = this.visibleName(currentNode)
            vm.menuItems = currentNode.children.map(mapToMenuItem)

            if (currentNode.parent) {
                vm.currentSelectedBackTarget = {
                    visible: true,
                    routeId: currentNode.parent.model.routeId
                }
                vm.showBack = true
            }
        }

        return vm
    }

    visibleName = (node: Node<NavigationNode>) => {
        const navigationNode: NavigationNode = node.model
        console.log(`Visible name: ${navigationNode.text} ${navigationNode.routeId}`)
        return navigationNode.text + ' > ' + navigationNode.routeId
    }

    back = () => {
        this._navigationRepository.back()
    }

    goToId = (routeId: RouteId) => {
        this._router.navigate(routeId)
    }
}

const mapToMenuItem = (node: Node<NavigationNode>): MenuItem => {
    const navigationNode: NavigationNode = node.model
    return {
        routeId: navigationNode.routeId,
        visibleName: node.model.text
    }
}