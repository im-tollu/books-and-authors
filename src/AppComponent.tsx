import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react';
import { AppPresenter } from './AppPresenter';
import { LoginRegisterComponent } from './Authentication/LoginRegisterComponent';
import { useInjection } from './Core/Providers/Injection';
import { RouteId } from './Routing/RouteDefinitions';
import { Router } from './Routing/Router';

export const AppComponent: React.FC = observer(() => {
  const presenter = useInjection<AppPresenter>(AppPresenter)

  useEffect(() => {

  }, [])

  if (presenter.currentRouteId === RouteId.LoginRoute) {
    return (
      <div className="container">
        <LoginRegisterComponent />
      </div>
    )
  }

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