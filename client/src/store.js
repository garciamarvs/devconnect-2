import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import setAuthToken from './utils/setAuthToken';

const initialState = {};

const middlewares = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

let currentState = store.getState();

// console.log('Starting Token: ', currentState.auth.token);

store.subscribe(() => {
  let previousState = currentState;

  currentState = store.getState();

  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    // console.log('New Token: ', currentState.auth.token);

    setAuthToken(token);
  }
});

export default store;
