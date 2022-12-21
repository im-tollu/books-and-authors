import { inject, injectable } from "inversify";
import { computed, makeObservable, observable } from "mobx";
import { BooksRepository } from "./BooksRepository";

export interface BooksViewModel {
    books: string
}

@injectable()
export class BooksPresenter {
    newBookName: string | null

    constructor(
        @inject(BooksRepository) _booksRepository: BooksRepository
    ) {
        this.newBookName = null

        makeObservable(this, {
            newBookName: observable,
            viewModel: computed
        })
    }

    get viewModel(): BooksViewModel {
        return {
            books: 'none'
        }
    }

    reset = () => {
        this.newBookName = ''
    }
}