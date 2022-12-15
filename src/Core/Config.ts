import { injectable, inject } from 'inversify'

@injectable()
export class Config {
    secureApiUrl: string

    constructor() {
        this.secureApiUrl = 'https://api.logicroom.co/secure-api/im.tollu@gmail.com'
    }
}