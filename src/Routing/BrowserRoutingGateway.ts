import { IRoutingGateway } from "./IRoutingGateway";

export class BrowserRoutingGateway implements IRoutingGateway {
    subscribe = (handler: (routingString: string) => void) => {
        const onHashChange = (event: HashChangeEvent) => {
            handler(event.newURL)
        }

        handler(currentHash())
        window.addEventListener('hashchange', onHashChange)

    }

    navigate = (routingString: string) => {
        window.location.hash = routingString
    }

}

function currentHash(): string {
    if (window.location.hash.startsWith('#')) {
        return window.location.hash.substring(1)
    }
    return ''
}