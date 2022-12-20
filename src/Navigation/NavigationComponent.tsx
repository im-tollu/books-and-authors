import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { NavigationPresenter } from './NavigationPresenter'
import { LogoutComponent } from '../Authentication/LogoutComponent'
import { useInjection } from '../Core/Providers/Injection'

export const NavigationComponent: React.FC = observer(() => {
    const presenter = useInjection(NavigationPresenter)

    return (
        <div className="navigation-container">
            <div className="navigation-item-header" style={{ backgroundColor: '#5BCA06' }}>
                {presenter.viewModel.currentSelectedVisibleName}
            </div>
            {presenter.viewModel.menuItems.map((menuItem) => {
                return (
                    <div
                        key={menuItem.id}
                        className="navigation-item"
                        style={{
                            backgroundColor: '#3DE7CF'
                        }}
                        onClick={() => {
                            presenter.goToId(menuItem.id)
                        }}
                    >
                        {menuItem.visibleName}
                    </div>
                )
            })}
            {presenter.viewModel.showBack && (
                <div
                    className="navigation-item"
                    onClick={() => {
                        presenter.back()
                    }}
                    style={{ backgroundColor: '#2e91fc' }}
                >
                    <span>⬅ </span>Back
                </div>
            )}
            <LogoutComponent />
        </div>
    )
})
