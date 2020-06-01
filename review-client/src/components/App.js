import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import RestaurantListPage from './RestaurantListPage';
import RestaurantDetailPage from './RestaurantDetailPage';
import store from '../store'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/restaurants/:restaurantId">
              <RestaurantDetailPage />
            </Route>
            { /* Root page must be at the bottom,
              A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
            <Route path="/">
              <RestaurantListPage />
            </Route>
          </Switch>
        </Router>
      </Provider>
    );
  }
}
