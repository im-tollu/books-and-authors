import { observer } from "mobx-react-lite";
import { MessagesComponent } from "../Core/Messages/MessagesComponent";
import { useInjection } from "../Core/Providers/Injection";
import { AddBookComponent } from "./AddBookComponent";
import { BookListComponent } from "./BookListComponent";
import { BooksPresenter } from "./BooksPresenter";

export const BooksComponent: React.FC = observer(() => {
    const presenter = useInjection(BooksPresenter)

    return (
        <>
            <h1>Books</h1>
            <AddBookComponent />
            <br />
            <BookListComponent />
            <br />
            <MessagesComponent />
        </>
    )
})