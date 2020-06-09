import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewRestaurantForm from './NewRestaurantForm';
import RestaurantList from './RestaurantList';
import {
  fetchContract,
  fetchRestaurants,
  createRestaurant,
} from '../store/restaurants/actions';

class RestaurantListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewRestaurantForm: false,
    };

    // Class property syntax does not need explicit binding.
    // this.handleCreateRestaurant = this.handleCreateRestaurant.bind(this);
    // this.handleShowNewRestaurantForm = this.handleShowNewRestaurantForm.bind(this);
  }

  componentDidMount = async () => {
    if(this.props.contract === null) {
      await this.props.fetchContract();
    }
    const { accounts, contract } = this.props;
    this.props.fetchRestaurants(accounts[0], contract);
  }

  handleShowNewRestaurantForm = () => {
    this.setState((state) => (
      { showNewRestaurantForm: !state.showNewRestaurantForm }
    ));
  }

  handleCreateRestaurant = (newRestaurantName) => {
    const { accounts, contract } = this.props;
    this.props.createRestaurant(accounts[0], contract, {"title": newRestaurantName});
  }

  render() {
    const { restaurants } = this.props;
    const { showNewRestaurantForm } = this.state;
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
                onSave={this.handleCreateRestaurant}
              />
            )
            : null
        }
        { /* FIXME restaurants is empty when I refresh at the detail page and return back. */}
        <RestaurantList restaurants={restaurants} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    restaurants: state.restaurants.restaurants,
    accounts: state.restaurants.accounts,
    contract: state.restaurants.contract,
  }
}

const mapDispatchToProps = {
  fetchContract,
  fetchRestaurants,
  createRestaurant,
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantListPage);
