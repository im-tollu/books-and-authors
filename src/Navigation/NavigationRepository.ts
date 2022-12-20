import { injectable, inject } from 'inversify'
import TreeModel from 'tree-model'
import { AuthenticationRepository } from '../Authentication/AuthenticationRepository'
import { Router } from '../Routing/Router'
import { makeObservable, computed, action } from 'mobx'

export interface NavigationNode {
    id: string;
    type: string;
    text: string;
    children: NavigationNode[];
}

@injectable()
export class NavigationRepository {
    constructor(
        @inject(AuthenticationRepository) private _authenticationRepository: AuthenticationRepository,
        @inject(Router) private _router: Router,
    ) {
        makeObservable(this, {
            currentNode: computed,
            back: action
        })
    }

    get currentNode() {
        return this.getTree().all((node) => {
            return node.model.id === this._router.currentRoute.routeId
        })[0]
    }


    getTree = () => {
        let tree = new TreeModel()

        let root = tree.parse<NavigationNode>({
            id: 'homeLink',
            type: 'root',
            text: 'Home',
            children: []
        })

        return root
    }

    back = () => {
        let currentNode = this.currentNode
        this._router.navigate(currentNode.parent.model.id)
    }
}
