import { inject, injectable } from "inversify";
import { computed, makeObservable, observable } from "mobx";
import { BooksLoadState, BooksRepository } from "./BooksRepository";

export interface BooksViewModel {
    books: string
}

@injectable()
export class BooksPresenter {
    newBookName: string | null

    constructor(
        @inject(BooksRepository) private _booksRepository: BooksRepository
    ) {
        this.newBookName = null

        makeObservable(this, {
            newBookName: observable,
            viewModel: computed
        })
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