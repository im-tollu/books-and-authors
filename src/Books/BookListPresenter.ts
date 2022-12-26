import { injectable, inject } from "inversify";
import { computed, makeObservable } from "mobx";
import { BooksRepository } from "./BooksRepository";

export interface BookViewModel {
    name: string
}

@injectable()
export class BookListPresenter {
    constructor(
        @inject(BooksRepository) private _booksRepository: BooksRepository
    ) {
        makeObservable(this, {
            viewModel: computed
        })
    }

    get viewModel(): BookViewModel[] {
        if (!this._booksRepository.booksProgrammerModel) {
            return []
        }
        return this._booksRepository.booksProgrammerModel
            .map(book => {
                return {
                    name: book.name
                }
            })
    }
}