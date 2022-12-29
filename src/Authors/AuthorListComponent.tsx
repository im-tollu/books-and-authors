import * as React from 'react'
import { namedObserver } from "../Core/Observer";
import { useInjection } from "../Core/Providers/Injection";
import { AuthorsPresenter } from "./AuthorsPresenter";

export const AuthorListComponent: React.FC = namedObserver('AuthorListComponent', () => {
    const presenter = useInjection(AuthorsPresenter)

    const authors = presenter.viewModel
        .map(author => <div key={author.authorId}>({author.name}) | ({author.bookTitles})<br /></div>)

    if (!presenter.showAuthorsList) {
        return null
    }

    return (
        <>
            {authors}
        </>
    )
})