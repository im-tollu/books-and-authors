import { namedObserver } from "../Core/Observer";
import { IAddBookPresenter } from "./IAddBookPresenter";

interface Props {
    presenter: IAddBookPresenter
}

export const AddBookComponent: React.FC<Props> = namedObserver('AddBookComponent', ({ presenter }) => {
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = submitEvent => {
        submitEvent.preventDefault()
        presenter.addBook()
    }

    const handleChange: React.FormEventHandler<HTMLInputElement> = changeEvent => {
        presenter.newBookName = changeEvent.currentTarget.value
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={presenter.newBookName}
                        placeholder="Enter book name"
                        onChange={handleChange}
                    />
                    <input type="submit" value="Add book" />
                </label>
            </form>
        </div>
    )
})