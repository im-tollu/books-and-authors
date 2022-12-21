import { inject, injectable } from "inversify";
import { makeObservable, observable } from "mobx";
import { UserModel } from "../Authentication/UserModel";
import { Config } from "../Core/Config";
import type { IApiGateway } from "../Core/IApiGateway";
import { TYPE } from "../Core/Types";

export enum MessagePM {
    UNSET,
    LOADED,
    RESET
}

@injectable()
export class BooksRepository {
    messagePM: MessagePM = MessagePM.UNSET

    constructor(
        @inject(Config) private _config: Config,
        @inject(TYPE.IApiGateway) private _apiGateway: IApiGateway,
        @inject(UserModel) private _userModel: UserModel,
    ) {
        makeObservable(this, {
            messagePM: observable
        })
    }

    load = () => {
        setTimeout(() => {
            this.messagePM = MessagePM.LOADED
        }, 2000)
    }

    reset = () => {
        this.messagePM = MessagePM.RESET
    }
}