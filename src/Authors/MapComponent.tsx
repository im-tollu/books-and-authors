import * as React from 'react'
import { observer } from "mobx-react-lite";
import { useInjection } from '../Core/Providers/Injection';
import { AuthorsPresenter } from './AuthorsPresenter';

export const MapComponent: React.FC = observer(props => {
    const presenter = useInjection(AuthorsPresenter)

    return (
        <>
            <h1>AUTHORS - Map</h1>
        </>
    )
})