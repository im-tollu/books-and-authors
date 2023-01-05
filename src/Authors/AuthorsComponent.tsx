import { useInjection } from "../Core/Providers/Injection";
import { AuthorsPresenter } from "./AuthorsPresenter";
import { AuthorListComponent } from "./AuthorListComponent";
import { AddAuthorComponent } from "./AddAuthorComponent";
import { AddBookComponent } from "../Books/AddBookComponent";
import { BookListComponent } from "../Books/BookListComponent";
import { MessagesComponent } from "../Core/Messages/MessagesComponent";
import { namedObserver } from "../Core/Observer";
import { FC, useEffect } from "react";

export const AuthorsComponent: FC = namedObserver("AuthorsComponent", () => {
  const presenter = useInjection(AuthorsPresenter);

  useEffect(() => {
    presenter.load();
  }, [presenter]);

  return (
    <>
      <h1>Authors</h1>
      <input
        type="button"
        value="show author list"
        onClick={presenter.toggleShowAuthorsList}
      />
      <br />
      <AuthorListComponent />
      <br />
      <AddAuthorComponent />
      <br />
      <AddBookComponent presenter={presenter} />
      <br />
      <BookListComponent />
      <br />
      <MessagesComponent />
    </>
  );
});
