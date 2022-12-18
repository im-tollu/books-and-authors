import { IRoutingGateway } from "./IRoutingGateway";

export class BrowserRoutingGateway implements IRoutingGateway {
    subscribe = (handler: (routingString: string) => void) => {
        const onHashChange = (event: HashChangeEvent) => {
            const newUrl = new URL(event.newURL)
            handler(newUrl.hash)
        }

        handler(window.location.hash)
        window.addEventListener('hashchange', onHashChange)

    }

    navigate = (routingString: string) => {
        window.location.hash = routingString
    }

}
