import React from 'react';
import { Provider } from 'react-redux';
import RestaurantListPage from './RestaurantListPage';
import store from '../store'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RestaurantListPage />
      </Provider>
    );
  }
}
