import { injectable, inject } from 'inversify'
import TreeModel from 'tree-model'
import { AuthenticationRepository } from '../Authentication/AuthenticationRepository'
import { Router } from '../Routing/Router'
import { makeObservable, computed, action } from 'mobx'
import { RouteId } from '../Routing/RouteDefinitions'

export enum NavigationNodeType {
    Root = 'root',
    Link = 'link'
}

export interface NavigationNode {
    routeId: RouteId;
    type: NavigationNodeType;
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
        return this.getTree().first((node) => {
            const navigationNode: NavigationNode = node.model
            return navigationNode.routeId === this._router.currentRoute.routeDefinition.routeId
        })
    }


    getTree = () => {
        let tree = new TreeModel()

        let root = tree.parse<NavigationNode>({
            routeId: RouteId.HomeRoute,
            type: NavigationNodeType.Root,
            text: 'Home',
            children: [
                {
                    routeId: RouteId.BooksRoute,
                    type: NavigationNodeType.Link,
                    text: 'Books',
                    children: []
                },
                {
                    routeId: RouteId.AuthorsRoute,
                    type: NavigationNodeType.Link,
                    text: 'Authors',
                    children: [
                        {
                            routeId: RouteId.AuthorsRoute_AuthorPolicyRoute,
                            type: NavigationNodeType.Link,
                            text: 'Author Policy',
                            children: []
                        },
                        {
                            routeId: RouteId.AuthorsRoute_MapRoute,
                            type: NavigationNodeType.Link,
                            text: 'View Map',
                            children: []
                        }
                    ]
                }
            ]
        })

        return root
    }

    back = () => {
        let currentNode = this.currentNode
        if (!currentNode) {
            return
        }
        const parentNavigationNode: NavigationNode = currentNode.parent.model
        this._router.navigate(parentNavigationNode.routeId)
    }
}
