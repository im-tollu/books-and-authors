import { injectable } from "inversify"

@injectable()
export class Config {
    secureApiUrl: string
    publicApiUrl: string

    constructor() {
        this.secureApiUrl = 'https://api.logicroom.co/secure-api/im.tollu@gmail.com'
        this.publicApiUrl = 'https://api.logicroom.co/api/im.tollu@gmail.com'
    }
}