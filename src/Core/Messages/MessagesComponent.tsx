import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { MessagesPresenter } from './MessagesPresenter'
import { useInjection } from '../Providers/Injection'

export const MessagesComponent = observer((props) => {
    const presenter = useInjection(MessagesPresenter)

    return (
        <>
            {presenter.apiMessages.map((item, i) => {
                return (
                    <div style={{ backgroundColor: 'red' }} key={i}>
                        {' - '}
                        {item}
                    </div>
                )
            })}
            {presenter.uiMessages.map((item, i) => {
                return (
                    <div style={{ backgroundColor: 'orange' }} key={i}>
                        {' - '}
                        {item}
                    </div>
                )
            })}
        </>
    )
})
