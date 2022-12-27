import { inject, injectable } from "inversify";
import { computed, makeObservable, observable } from "mobx";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";
import { BooksLoadState, BooksRepository } from "./BooksRepository";
import { IAddBookPresenter } from "./IAddBookPresenter";

export interface BooksViewModel {
    books: string
}

@injectable()
export class BooksPresenter implements IAddBookPresenter {
    newBookName: string = ''

    constructor(
        @inject(BooksRepository) private _booksRepository: BooksRepository,
        @inject(MessagesPresenter) private _messagePresenter: MessagesPresenter,
    ) {
        makeObservable(this, {
            newBookName: observable,
            lastAddedBook: computed,
            viewModel: computed
        })
    }

    get lastAddedBook(): string | null {
        return this._booksRepository.lastAddedBook
    }

    get viewModel(): BooksLoadState {
        return this._booksRepository.messagePM
    }

    load = async () => {
        await this._booksRepository.load()
    }

    reset = () => {
        this.newBookName = ''
    }

    addBook = async () => {
        this._messagePresenter.reset()
        if (this.newBookName === '') {
            this._messagePresenter.addWarning('No book name')
            return
        }

        await this._booksRepository.add(this.newBookName)
        this.newBookName = ''
    }
}