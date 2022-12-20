import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useInjection } from '../Core/Providers/Injection'
import { LoginRegisterPresenter } from '../Authentication/LoginRegisterPresenter'

export const LogoutComponent: React.FC = observer(() => {
    const presenter = useInjection(LoginRegisterPresenter)

    return (
        <div
            onClick={() => {
                presenter.logOut()
            }}
            className="navigation-item"
            style={{ backgroundColor: '#5BCA06' }}
        >
            <span>☯ Logout</span>
        </div>
    )
})
