import { inject, injectable } from "inversify";
import { computed, makeObservable, observable } from "mobx";
import { BooksLoadState, BooksRepository } from "./BooksRepository";

export interface BooksViewModel {
    books: string
}

@injectable()
export class BooksPresenter {
    newBookName: string = ''

    constructor(
        @inject(BooksRepository) private _booksRepository: BooksRepository
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
}