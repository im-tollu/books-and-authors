import { observer } from "mobx-react-lite";
import { useInjection } from "../Core/Providers/Injection";
import { BookListPresenter } from "./BookListPresenter";

export const AddBookComponent: React.FC = observer(() => {
    const presenter = useInjection(BookListPresenter)

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = submitEvent => {
        submitEvent.preventDefault()
        presenter.addBook()
    }

    const handleChange: React.FormEventHandler<HTMLInputElement> = changeEvent => {
        presenter.newBookName = changeEvent.currentTarget.value
    }

    return (
        <div>
            <form className="login" onSubmit={handleSubmit}>
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