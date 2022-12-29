import { UserModel } from "../Authentication/UserModel"
import { BookListPresenter } from "../Books/BookListPresenter"
import { BooksPresenter } from "../Books/BooksPresenter"
import { IApiGateway } from "../Core/IApiGateway"
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter"
import { TYPE } from "../Core/Types"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetBooksStub } from "../TestTools/GetBooksStub"
import { SingleBookResultStub } from "../TestTools/GetSingleBookResultStub"
import { GetSuccessAuthorsStub } from "../TestTools/GetSuccessAuthorsStub"
import { GetSuccessFewAuthorsStub } from "../TestTools/GetSuccessFewAuthorsStub"
import { GetSuccessManyAuthorsStub } from "../TestTools/GetSuccessManyAuthorsStub"
import { PostAuthorSuccessStub } from "../TestTools/PostAuthorSuccessStub"
import { PostBookSuccessStub } from "../TestTools/PostBookSuccessStub"
import { AuthorsPresenter } from "./AuthorsPresenter"

interface AuthorsApp {
    authorsPresenter: AuthorsPresenter
    booksPresenter: BooksPresenter
    bookListPresenter: BookListPresenter
    messagesPresenter: MessagesPresenter
    userModel: UserModel
    apiGateway: IApiGateway
}

describe('authors', () => {
    let app: AuthorsApp | null = null

    beforeEach(async () => {
        const container = initTestApp()
        app = {
            authorsPresenter: container.get(AuthorsPresenter),
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
        it('should load list author and books into ViewModel', async () => {
            const { authorsPresenter, apiGateway, userModel } = app!
            userModel.email = 'a@b.com'
            const apiGetMock = apiGateway.get as jest.Mock
            apiGetMock
                .mockResolvedValueOnce(GetSuccessAuthorsStub())
                .mockResolvedValueOnce(SingleBookResultStub('Book 1', 1))
                .mockResolvedValueOnce(SingleBookResultStub('Book 2', 2))
                .mockResolvedValueOnce(SingleBookResultStub('Book 3', 3))

            await authorsPresenter.load()

            expect(apiGetMock).nthCalledWith(1, '/authors?emailOwnerId=a@b.com')
            expect(apiGetMock).nthCalledWith(2, '/book?emailOwnerId=a@b.com&bookId=1')
            expect(apiGetMock).nthCalledWith(3, '/book?emailOwnerId=a@b.com&bookId=2')
            expect(apiGetMock).nthCalledWith(4, '/book?emailOwnerId=a@b.com&bookId=3')
            expect(authorsPresenter.viewModel).toEqual([
                {
                    authorId: 1,
                    bookTitles: 'Book 1,Book 2',
                    name: 'Isaac Asimov',
                },
                {
                    authorId: 2,
                    bookTitles: 'Book 3',
                    name: 'Kenneth Graeme',
                },
            ])
        })

        it('should show author list (toggle) when has authors', async () => {
            const { authorsPresenter, apiGateway, userModel } = app!
            userModel.email = 'a@b.com'
            const apiGetMock = apiGateway.get as jest.Mock
            apiGetMock.mockResolvedValueOnce(GetSuccessFewAuthorsStub())

            await authorsPresenter.load()

            expect(authorsPresenter.showAuthorsList).toEqual(true)
        })

        it('should hide author list (toggle) when has more than 4 authors', async () => {
            const { authorsPresenter, apiGateway, userModel } = app!
            userModel.email = 'a@b.com'
            const apiGetMock = apiGateway.get as jest.Mock
            apiGetMock.mockResolvedValueOnce(GetSuccessManyAuthorsStub())

            await authorsPresenter.load()

            expect(authorsPresenter.showAuthorsList).toEqual(false)
        })
    })

    describe('saving', () => {
        it('should allow single author to be added and will reload authors list', async () => {
            const { authorsPresenter, apiGateway, userModel } = app!
            userModel.email = 'a@b.com'
            const apiPostMock = apiGateway.post as jest.Mock
            const apiGetMock = apiGateway.get as jest.Mock

            authorsPresenter.newAuthorName = 'New Author'
            apiPostMock.mockResolvedValueOnce(PostAuthorSuccessStub(789))
            apiGetMock.mockResolvedValue(GetSuccessAuthorsStub())

            await authorsPresenter.addAuthor()

            expect(apiPostMock).toBeCalledWith('/authors', {
                name: 'New Author',
                emailOwnerId: 'a@b.com',
                bookIds: []
            })
            expect(apiGetMock).nthCalledWith(1, '/authors?emailOwnerId=a@b.com')
            expect(apiGetMock).nthCalledWith(2, '/book?emailOwnerId=a@b.com&bookId=1')
            expect(apiGetMock).nthCalledWith(3, '/book?emailOwnerId=a@b.com&bookId=2')
            expect(apiGetMock).nthCalledWith(4, '/book?emailOwnerId=a@b.com&bookId=3')
        })

        it('should allow books to be staged and then save authors and books to api', async () => {
            const { authorsPresenter, apiGateway, userModel } = app!
            userModel.email = 'a@b.com'
            const apiPostMock = apiGateway.post as jest.Mock
            const apiGetMock = apiGateway.get as jest.Mock

            authorsPresenter.newBookName = 'New Book 1'
            await authorsPresenter.addBook()

            expect(authorsPresenter.newBookName).toEqual('')
            expect(apiGateway.post).not.toBeCalled()

            authorsPresenter.newBookName = 'New Book 2'
            await authorsPresenter.addBook()

            expect(authorsPresenter.newBookName).toEqual('')
            expect(apiGateway.post).not.toBeCalled()

            authorsPresenter.newAuthorName = 'New Author'
            apiPostMock
                .mockResolvedValueOnce(PostBookSuccessStub(123))
                .mockResolvedValueOnce(PostBookSuccessStub(456))
                .mockResolvedValueOnce(PostAuthorSuccessStub(789))
            apiGetMock
                .mockResolvedValue(GetSuccessAuthorsStub())

            await authorsPresenter.addAuthor()

            expect(apiPostMock).nthCalledWith(1, '/books', {
                emailOwnerId: 'a@b.com',
                name: 'New Book 1'
            })
            expect(apiPostMock).nthCalledWith(2, '/books', {
                emailOwnerId: 'a@b.com',
                name: 'New Book 2'
            })
            expect(apiPostMock).nthCalledWith(3, '/authors', {
                name: 'New Author',
                emailOwnerId: 'a@b.com',
                bookIds: [123, 456]
            })
        })
    })
})