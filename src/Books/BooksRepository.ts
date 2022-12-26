import { inject, injectable } from "inversify";
import { makeObservable, observable } from "mobx";
import { UserModel } from "../Authentication/UserModel";
import { Config } from "../Core/Config";
import type { IApiGateway } from "../Core/IApiGateway";
import { TYPE } from "../Core/Types";

export enum BooksLoadState {
    UNSET = 'UNSET',
    LOADED = 'LOADED',
    RESET = 'RESET'
}

export interface BookProgrammerModel {
    bookId: number
    name: string
}

export interface GetBooksResult_Book {
    bookId: number
    name: string
    emailOwnerId: string
    devOwnerId: string
}

export type GetBooksResult = GetBooksResult_Book[]

@injectable()
export class BooksRepository {
    messagePM: BooksLoadState = BooksLoadState.UNSET
    booksProgrammerModel: BookProgrammerModel[] | null = null

    constructor(
        @inject(Config) private _config: Config,
        @inject(TYPE.IApiGateway) private _apiGateway: IApiGateway,
        @inject(UserModel) private _userModel: UserModel,
    ) {
        makeObservable(this, {
            messagePM: observable,
            booksProgrammerModel: observable
        })
    }

    load = async () => {
        const responseDto = await this._apiGateway.getPublic('/books')
        if (responseDto.success) {
            const booksDto = responseDto.result as GetBooksResult
            this.booksProgrammerModel = booksDto.map(book => {
                return {
                    bookId: book.bookId,
                    name: book.name
                }
            })
            this.messagePM = BooksLoadState.LOADED
        }
    }

    reset = () => {
        this.messagePM = BooksLoadState.RESET
    }
}