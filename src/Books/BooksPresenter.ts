import { inject, injectable } from "inversify";
import { computed, makeObservable, observable } from "mobx";
import { BooksPM, BooksRepository } from "./BooksRepository";

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

    get viewModel(): BooksPM {
        return this._booksRepository.messagePM
    }

    reset = () => {
        this.newBookName = ''
    }
}