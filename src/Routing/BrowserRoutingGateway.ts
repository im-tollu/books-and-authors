import { IRoutingGateway } from "./IRoutingGateway";

export class BrowserRoutingGateway implements IRoutingGateway {
    subscribe = (handler: (routingString: string) => void) => {
        const onHashChange = (event: HashChangeEvent) => {
            const newUrl = new URL(event.newURL)
            handler(newUrl.hash)
        }

        window.addEventListener('hashchange', onHashChange)
        handler(window.location.hash)
    }

    navigate = (routingString: string) => {
        window.location.hash = routingString
    }

}
