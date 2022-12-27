export interface IAddBookPresenter {
    newBookName: string
    addBook: () => Promise<void>
}