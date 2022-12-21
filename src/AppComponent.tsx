import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react';
import { AppPresenter } from './AppPresenter';
import { LoginRegisterComponent } from './Authentication/LoginRegisterComponent';
import { AuthorsComponent } from './Authors/AuthorsComponent';
import { BooksComponent } from './Books/BooksComponent';
import { useInjection } from './Core/Providers/Injection';
import { HomeComponent } from './Home/HomeComponent';
import { NavigationComponent } from './Navigation/NavigationComponent';
import { RouteId } from './Routing/RouteDefinitions';
import { Router } from './Routing/Router';

interface RenderedComponent {
  routeId: RouteId,
  component: JSX.Element
}

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

  const renderedComponents: RenderedComponent[] = [
    {
      routeId: RouteId.HomeRoute,
      component: <HomeComponent key={RouteId.HomeRoute} />
    }
  ]

  return (
    <div className="container">
      <div className="w3-row">
        <div className="w3-col s4 w3-center">
          <NavigationComponent />
        </div>
        <div className="w3-col s8 w3-left">
          {currentComponent(presenter.currentRouteId)}
        </div>
      </div>
    </div>
  );
})

const currentComponent = (routeId: RouteId): JSX.Element => {
  switch (routeId) {
    case RouteId.HomeRoute:
      return <HomeComponent key={RouteId.HomeRoute} />
    case RouteId.BooksRoute:
      return <BooksComponent key={RouteId.BooksRoute} />
    case RouteId.AuthorsRoute:
      return <AuthorsComponent key={RouteId.AuthorsRoute} />
    default:
      throw new Error(`Component not found for routeId [${routeId}]`)
  }
}