import { reaction } from "mobx"
import { UserModel } from "../Authentication/UserModel"
import { Config } from "../Core/Config"
import { IApiGateway } from "../Core/IApiGateway"
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter"
import { TYPE } from "../Core/Types"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetBooksStub } from "../TestTools/GetBooksStub"
import { PostBookSuccessStub } from "../TestTools/PostBookSuccessStub"
import { BookListPresenter } from "./BookListPresenter"
import { BooksPresenter } from "./BooksPresenter"

interface BooksApp {
    booksPresenter: BooksPresenter
    bookListPresenter: BookListPresenter
    messagesPresenter: MessagesPresenter
    userModel: UserModel
    apiGateway: IApiGateway
}

describe('books', () => {
    let app: BooksApp | null = null

    beforeEach(() => {
        const container = initTestApp()
        app = {
            booksPresenter: container.get(BooksPresenter),
            bookListPresenter: container.get(BookListPresenter),
            messagesPresenter: container.get(MessagesPresenter),
            userModel: container.get(UserModel),
            apiGateway: container.get(TYPE.IApiGateway),
        }
        const mockGetBooks = app.apiGateway.get as unknown as jest.Mock
        mockGetBooks.mockResolvedValue(GetBooksStub())
        app.userModel.email = 'a@b.com'
        app.userModel.token = 'a@b1234.com'
    })

    describe('loading', () => {
        it('should show book list', async () => {
            const { booksPresenter, bookListPresenter, apiGateway } = app!

            await booksPresenter.load()

            expect(apiGateway.get).toBeCalledWith('/books?emailOwnerId=a@b.com')
            expect(bookListPresenter.viewModel).toEqual([
                {
                    bookId: 881,
                    name: 'Wind in the willows',
                },
                {
                    bookId: 891,
                    name: 'I, Robot',
                },
            ])
        })
    })

    describe('saving', () => {
        let lastAddedBook: string | null = null

        beforeEach(async () => {
            const { bookListPresenter, booksPresenter, apiGateway } = app!
            const mockPostBooks = apiGateway.post as unknown as jest.Mock
            mockPostBooks.mockResolvedValue(PostBookSuccessStub(1234))
            reaction(
                () => booksPresenter.lastAddedBook,
                updatedLastAddedBook => {
                    lastAddedBook = updatedLastAddedBook
                }
            )

            booksPresenter.newBookName = 'A New Book'
            await booksPresenter.addBook()
        })

        it('should reload book list', async () => {
            const { apiGateway } = app!

            expect(apiGateway.post).toBeCalledWith('/books', {
                emailOwnerId: 'a@b.com',
                name: 'A New Book',
            })
            expect(apiGateway.get).toBeCalledWith('/books?emailOwnerId=a@b.com')
        })

        it('should update books message', async () => {
            const { messagesPresenter } = app!

            expect(messagesPresenter.successes).toContain('Book Added')
        })

        it('should update last added book', async () => {
            expect(lastAddedBook).toEqual('A New Book')
        })
    })
})