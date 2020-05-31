import React, { Component } from 'react';
import NewRestaurantForm from './NewRestaurantForm'
import RestaurantList from './RestaurantList'

export default class RestaurantListPage extends Component {
  constructor(props) {
    super(props);
    this.state = { restaurantNames: [] };
    this.handleAddRestaurant = this.handleAddRestaurant.bind(this);
  }

  handleAddRestaurant(newRestaurantName) {
    this.setState(state => ({
      restaurantNames: [
        newRestaurantName,
        ...state.restaurantNames
      ]
    }));
  }

  render() {
    const { restaurantNames } = this.state;
    return (
      <div>
        <button
          data-test="addNewRestaurant"
        >
          Add Restaurant
        </button>
        <NewRestaurantForm
          onSave={this.handleAddRestaurant}
        />
        <RestaurantList restaurantNames={restaurantNames} />
      </div>
    )
  }
}
