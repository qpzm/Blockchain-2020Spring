import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewRestaurantForm from './NewRestaurantForm';
import RestaurantList from './RestaurantList';
import { addRestaurant } from '../store/restaurants/actions';
import getWeb3 from '../store/web3';

class RestaurantListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewRestaurantForm: false,
    };
    this.handleAddRestaurant = this.handleAddRestaurant.bind(this);
    this.handleShowNewRestaurantForm = this.handleShowNewRestaurantForm.bind(this);
  }

  componentDidMount = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
  }

  handleShowNewRestaurantForm() {
    this.setState((state) => (
      { showNewRestaurantForm: !state.showNewRestaurantForm }
    ));
  }

  handleAddRestaurant(newRestaurantName) {
    this.props.addRestaurant(newRestaurantName);
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
                onSave={this.handleAddRestaurant}
              />
            )
            : null
        }
        <RestaurantList restaurantNames={restaurants} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    restaurants: state.restaurants,
  }
}

const mapDispatchToProps = {
  addRestaurant,
}

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantListPage);
