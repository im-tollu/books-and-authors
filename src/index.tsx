import 'reflect-metadata'
import { configure } from 'mobx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppComponent } from './AppComponent';
import reportWebVitals from './reportWebVitals';
import { container } from './AppIOC'
import { InjectionProvider } from './Core/Providers/Injection';

configure({
  enforceActions: 'never',
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: false
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <InjectionProvider container={container}>
      <AppComponent />
    </InjectionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
