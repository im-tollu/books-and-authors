import { namedObserver } from "../Core/Observer"
import { useInjection } from "../Core/Providers/Injection"
import { AuthorsPresenter } from "./AuthorsPresenter"

export const AddAuthorComponent: React.FC = namedObserver('AddAuthorComponent', () => {
    const presenter = useInjection(AuthorsPresenter)

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (submitEvent) => {
        submitEvent.preventDefault()
        presenter.addAuthor()
    }

    const handleChange: React.FormEventHandler<HTMLInputElement> = (changeEvent) => {
        presenter.newAuthorName = changeEvent.currentTarget.value
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={presenter.newAuthorName}
                        placeholder="Enter author name"
                        onChange={handleChange}
                    />
                    <input type="submit" value="Submit author and books" />
                </label>
            </form>
        </div>
    )
})