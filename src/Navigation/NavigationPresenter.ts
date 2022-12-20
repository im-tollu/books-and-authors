import { inject, injectable } from 'inversify'
import { Node } from 'tree-model'
import { computed, makeObservable } from 'mobx'
import { NavigationNode, NavigationRepository } from '../Navigation/NavigationRepository'
import { RouteId } from '../Routing/RouteDefinitions'
import { Router } from '../Routing/Router'

interface BackTarget {
    visible: boolean
    id: RouteId | null
}

interface MenuItem {
    id: RouteId
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

    get viewModel() {
        const vm: Menu = {
            showBack: false,
            currentSelectedVisibleName: '',
            currentSelectedBackTarget: { visible: false, id: null },
            menuItems: []
        }

        let currentNode = this._navigationRepository.currentNode

        if (currentNode) {
            vm.currentSelectedVisibleName = this.visibleName(currentNode)
            vm.menuItems = currentNode.children.map((node: Node<NavigationNode>) => {
                return { id: node.model.id, visibleName: node.model.text }
            })

            if (currentNode.parent) {
                vm.currentSelectedBackTarget = {
                    visible: true,
                    id: currentNode.parent.model.id
                }
                vm.showBack = true
            }
        }

        return vm
    }

    visibleName = (node: Node<NavigationNode>) => {
        return node.model.text + ' > ' + node.model.id
    }

    back = () => {
        this._navigationRepository.back()
    }

    goToId = (routeId: RouteId) => {
        this._router.navigate(routeId)
    }
}
