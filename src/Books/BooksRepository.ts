import { inject, injectable } from "inversify";
import { makeObservable, observable } from "mobx";
import { UserModel } from "../Authentication/UserModel";
import { Config } from "../Core/Config";
import type { ErrorResult, IApiGateway } from "../Core/IApiGateway";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";
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

export interface AddedBookResult {
    message: string
    bookId: number
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
        @inject(MessagesPresenter) private _messagesPresenter: MessagesPresenter,
    ) {
        makeObservable(this, {
            messagePM: observable,
            booksProgrammerModel: observable
        })
    }

    load = async () => {
        const responseDto = await this._apiGateway.get(`/books?emailOwnerId=${this._userModel.email}`)
        if (!responseDto.success) {
            const errorResult = responseDto.result as ErrorResult
            this._messagesPresenter.addError(errorResult.message)
            return
        }

        const booksDto = responseDto.result as GetBooksResult
        this.booksProgrammerModel = booksDto.map(book => {
            return {
                bookId: book.bookId,
                name: book.name
            }
        })
        this.messagePM = BooksLoadState.LOADED
    }

    add = async (name: string) => {
        const emailOwnerId = this._userModel.email
        const responseDto = await this._apiGateway.post('/books', { name, emailOwnerId })
        if (!responseDto.success) {
            const errorResult = responseDto.result as ErrorResult
            this._messagesPresenter.addError(errorResult.message)
            return
        }

        const addedBookResult = responseDto.result as AddedBookResult
        this._messagesPresenter.addSuccess(addedBookResult.message)
        await this.load()
    }

    reset = () => {
        this.messagePM = BooksLoadState.RESET
    }
}