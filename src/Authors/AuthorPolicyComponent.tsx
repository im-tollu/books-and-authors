import * as React from 'react'
import { observer } from "mobx-react-lite";
import { useInjection } from '../Core/Providers/Injection';
import { AuthorsPresenter } from './AuthorsPresenter';

export const AuthorPolicyComponent: React.FC = observer(props => {
    const presenter = useInjection(AuthorsPresenter)

    return (
        <>
            <h1>AUTHORS - Author Policy</h1>
        </>
    )
})