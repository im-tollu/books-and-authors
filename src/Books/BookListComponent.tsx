import { namedObserver } from "../Core/Observer";
import { useInjection } from "../Core/Providers/Injection";
import { BookListPresenter } from "./BookListPresenter";

export const BookListComponent: React.FC = namedObserver('BookListComponent', () => {
    const presenter = useInjection(BookListPresenter)
    const books = presenter.viewModel.map(book => {
        return <li key={book.bookId}>{book.name}</li>
    })

    return (
        <ul>
            {books}
        </ul>
    )
})