import { observer } from "mobx-react-lite";
import { MessagesComponent } from "../Core/Messages/MessagesComponent";
import { useInjection } from "../Core/Providers/Injection";
import { AddBookComponent } from "./AddBookComponent";
import { BookListComponent } from "./BookListComponent";
import { BooksPresenter } from "./BooksPresenter";
import { LastAddedBookComponent } from "./LastAddedBookComponent";

export const BooksComponent: React.FC = observer(() => {
  const presenter = useInjection(BooksPresenter);

  return (
    <>
      <h1>Books</h1>
      <LastAddedBookComponent lastAddedBook={presenter.lastAddedBook} />
      <br />
      <AddBookComponent presenter={presenter} />
      <br />
      <BookListComponent />
      <br />
      <MessagesComponent />
    </>
  );
});
