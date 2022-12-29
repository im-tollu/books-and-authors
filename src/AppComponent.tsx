import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react';
import { AppPresenter } from './AppPresenter';
import { LoginRegisterComponent } from './Authentication/LoginRegisterComponent';
import { AuthorPolicyComponent } from './Authors/AuthorPolicyComponent';
import { AuthorsComponent } from './Authors/AuthorsComponent';
import { BooksComponent } from './Books/BooksComponent';
import { useInjection } from './Core/Providers/Injection';
import { HomeComponent } from './Home/HomeComponent';
import { NavigationComponent } from './Navigation/NavigationComponent';
import { RouteId } from './Routing/RouteDefinitions';

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
  console.log('currentComponent#routeId:', routeId)
  switch (routeId) {
    case RouteId.HomeRoute:
      return <HomeComponent />
    case RouteId.BooksRoute:
      return <BooksComponent />
    case RouteId.AuthorsRoute:
      return <AuthorsComponent />
    case RouteId.AuthorsRoute_AuthorPolicyRoute:
      return <AuthorPolicyComponent />
    case RouteId.AuthorsRoute_MapRoute:
      return <AuthorPolicyComponent />
    default:
      throw new Error(`Component not found for routeId [${routeId}]`)
  }
}