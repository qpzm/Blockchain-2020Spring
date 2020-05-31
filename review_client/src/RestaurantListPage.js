import React, { Component } from 'react';
import NewRestaurantForm from './NewRestaurantForm'
import RestaurantList from './RestaurantList'

export default class RestaurantListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantNames: [],
      showNewRestaurantForm: false,
    };
    this.handleAddRestaurant = this.handleAddRestaurant.bind(this);
    this.handleShowNewRestaurantForm = this.handleShowNewRestaurantForm.bind(this);
  }

  handleShowNewRestaurantForm() {
    this.setState((state) => (
      { showNewRestaurantForm: !state.showNewRestaurantForm }
    ));
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
    const {
      restaurantNames,
      showNewRestaurantForm,
    } = this.state;
    return (
      <div>
        <button
          onClick={this.handleShowNewRestaurantForm}
          data-test="addNewRestaurant"
        >
          Add Restaurant
        </button>
        {
          showNewRestaurantForm
            ? (
              <NewRestaurantForm
                onSave={this.handleAddRestaurant}
              />
            )
            : null
        }
        <RestaurantList restaurantNames={restaurantNames} />
      </div>
    )
  }
}
