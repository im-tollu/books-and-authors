import { observer } from "mobx-react-lite";
import { useInjection } from "../Core/Providers/Injection";
import { BooksPresenter } from "./BooksPresenter";

export const BooksComponent: React.FC = observer(() => {
    const presenter = useInjection(BooksPresenter)

    return (
        <>
            <h1>BOOKS</h1>
            {presenter.viewModel.books}
        </>
    )
})