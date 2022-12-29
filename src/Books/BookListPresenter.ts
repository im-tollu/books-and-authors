import { injectable, inject } from "inversify";
import { computed, makeObservable, observable } from "mobx";
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter";
import { BooksRepository } from "./BooksRepository";

export interface BookViewModel {
    bookId: number
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
        return this._booksRepository.booksProgrammerModel
            .map(book => {
                return {
                    bookId: book.bookId,
                    name: book.name
                }
            })
    }
}