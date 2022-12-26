import { observer } from "mobx-react-lite";
import { useInjection } from "../Core/Providers/Injection";
import { BookListPresenter } from "./BookListPresenter";

export const BookListComponent: React.FC = observer(() => {
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