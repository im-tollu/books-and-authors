import * as React from 'react'
import { MessagesPresenter } from './MessagesPresenter'
import { useInjection } from '../Providers/Injection'
import { namedObserver } from '../Observer'

export const MessagesComponent: React.FC = namedObserver('MessagesComponent', () => {
    const presenter = useInjection(MessagesPresenter)

    return (
        <>
            {presenter.errors.map((item, i) => {
                return (
                    <div style={{ backgroundColor: 'red' }} key={i}>
                        {' - '}
                        {item}
                    </div>
                )
            })}
            {presenter.warnings.map((item, i) => {
                return (
                    <div style={{ backgroundColor: 'orange' }} key={i}>
                        {' - '}
                        {item}
                    </div>
                )
            })}
            {presenter.successes.map((item, i) => {
                return (
                    <div style={{ backgroundColor: 'green' }} key={i}>
                        {' - '}
                        {item}
                    </div>
                )
            })}
        </>
    )
})
