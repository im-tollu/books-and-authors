import { observer } from 'mobx-react-lite'
import React from 'react';
import { AppPresenter } from './AppPresenter';
import { useInjection } from './Core/Providers/Injection';
import { Router } from './Routing/Router';

export const AppComponent: React.FC = observer(() => {
  const presenter = useInjection<AppPresenter>(AppPresenter)

  return (
    <div className="container">
      <h1>{presenter.appName}</h1>

      <dl>
        <dt>Current route from Presenter</dt>
        <dd>{presenter.currentRouteId}</dd>
      </dl>
    </div>
  );
})