import { IApiGateway } from "../Core/IApiGateway"
import { TYPE } from "../Core/Types"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetBooksStub } from "../TestTools/GetBooksStub"
import { BookListPresenter } from "./BookListPresenter"
import { BooksPresenter } from "./BooksPresenter"

interface BooksApp {
    booksPresenter: BooksPresenter
    bookListPresenter: BookListPresenter
    apiGateway: IApiGateway
}

describe('books', () => {
    let app: BooksApp | null = null

    beforeEach(() => {
        const container = initTestApp()
        app = {
            booksPresenter: container.get(BooksPresenter),
            bookListPresenter: container.get(BookListPresenter),
            apiGateway: container.get(TYPE.IApiGateway)
        }
        const mockGetBooks = app.apiGateway.getPublic as unknown as jest.Mock
        mockGetBooks.mockResolvedValue(GetBooksStub())
    })

    describe('loading', () => {
        it('should show book list', async () => {
            const { booksPresenter, bookListPresenter } = app!

            await booksPresenter.load()
            expect(bookListPresenter.viewModel).toEqual([
                {
                    name: 'Wind in the willows',
                },
                {
                    name: 'I, Robot',
                },
                {
                    name: 'The Hobbit',
                },
                {
                    name: 'Wind In The Willows 2',
                },
            ])
        })
    })

    describe('saving', () => {
        beforeEach(async () => {

        })

        it('should reload book list', async () => {

        })

        it('should update books message', async () => {

        })
    })
})