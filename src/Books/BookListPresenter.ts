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
    newBookName: string

    constructor(
        @inject(BooksRepository) private _booksRepository: BooksRepository,
        @inject(MessagesPresenter) private _messagePresenter: MessagesPresenter,
    ) {
        this.newBookName = ''

        makeObservable(this, {
            newBookName: observable,
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
                    bookId: book.bookId,
                    name: book.name
                }
            })
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