import { UserModel } from "../Authentication/UserModel"
import { BookListPresenter } from "../Books/BookListPresenter"
import { BooksPresenter } from "../Books/BooksPresenter"
import { IApiGateway } from "../Core/IApiGateway"
import { MessagesPresenter } from "../Core/Messages/MessagesPresenter"
import { TYPE } from "../Core/Types"
import { initTestApp } from "../TestTools/AppTestHarness"
import { GetBooksStub } from "../TestTools/GetBooksStub"

interface AuthorsApp {
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

        })

        it('should show author list (toggle) when has authors', async () => {

        })

        it('should hide author list (toggle) when has more than 4 authors', async () => {

        })
    })

    describe('saving', () => {
        it('should allow single author to be added and will reload authors list', async () => {

        })

        it('should allow books to be staged and then save authors and books to api', async () => {

        })
    })
})