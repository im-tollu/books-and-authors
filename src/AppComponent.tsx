import { observer } from 'mobx-react-lite'
import React from 'react';

export const AppComponent: React.FC = observer(() => {
  return (
    <div className="container">
      Books & Authors
    </div>
  );
})