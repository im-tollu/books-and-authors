import * as React from 'react'
import { observer } from "mobx-react-lite";
import { useInjection } from '../Core/Providers/Injection';
import { AuthorsPresenter } from './AuthorsPresenter';
import { AuthorListComponent } from './AuthorListComponent';
import { AddAuthorComponent } from './AddAuthorComponent';
import { AddBookComponent } from '../Books/AddBookComponent';
import { BookListComponent } from '../Books/BookListComponent';
import { MessagesComponent } from '../Core/Messages/MessagesComponent';

export const AuthorsComponent: React.FC = observer(props => {
    const presenter = useInjection(AuthorsPresenter)

    return (
        <>
            <h1>Authors</h1>
            <input type="button" value="show author list" onClick={presenter.toggleShowBooks} />
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
    )
})