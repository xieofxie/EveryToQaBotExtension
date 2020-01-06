import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'botframework-webchat';
import { Dispatcher } from "flux";

const eventDispatcher = new Dispatcher();

const store = createStore({},
  () => next => action => {
  if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
    if (action.payload.activity.type === "event") {
      eventDispatcher.dispatch(action.payload.activity);
    }
  }
  return next(action);
});

ReactDOM.render(<App store={store} eventDispatcher={eventDispatcher} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
