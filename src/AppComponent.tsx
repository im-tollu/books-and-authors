import { observer } from 'mobx-react-lite'
import React from 'react';
import { AppPresenter } from './AppPresenter';
import { useInjection } from './Core/Providers/Injection';

export const AppComponent: React.FC = observer(() => {
  const presenter = useInjection(AppPresenter)

  return (
    <div className="container">
      {presenter.appName}
    </div>
  );
})