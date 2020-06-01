import React, { Component } from 'react';
//import { connect } from 'react-redux';
import NewRestaurantForm from './NewRestaurantForm';
import RestaurantList from './RestaurantList';
//import { addrant } from '../store/restaurants/actions';
import getWeb3 from '../store/web3';
import NoncenseContract from '../contracts/Noncense.js';

class RestaurantListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      showNewRestaurantForm: false,
      web3: null,
      accounts: null,
      contract: null,
    };
    this.handleAddRestaurant = this.handleAddRestaurant.bind(this);
    this.handleShowNewRestaurantForm = this.handleShowNewRestaurantForm.bind(this);
  }

  componentDidMount = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = NoncenseContract.networks[networkId];
    const instance = new web3.eth.Contract(
      NoncenseContract.abi,
      deployedNetwork && deployedNetwork.address,
    );

    this.setState({ web3, accounts, contract: instance }, this.fetchRestaurants)
  }

  fetchRestaurants = async () => {
    const { accounts, contract } = this.state;

    await contract.methods.getIdsByParentId(0, 0, 0).call({ from: accounts[0] })
      .then((restaurantIds) => {
        restaurantIds.forEach(async (id) => {
          await contract.methods.post(id).call({ from: accounts[0] })
            .then((restaurant) => {
              try {
                restaurant.metadata = JSON.parse(restaurant.metadata);
              } catch(e) {
                restaurant.metadata = "";
              }
              this.setState((state) => ({ restaurants: [...state.restaurants, restaurant] }));
            })
        });
      });
  };

  createRestaurant = async (content, title, metadata={}, isImmutable=false) => {
    const { accounts, contract } = this.state;
    const metadataStr = JSON.stringify(metadata);
    await contract.methods.newPost(content, 0, title, metadataStr, isImmutable)
      .send({ from: accounts[0] })
      .then((event) => { console.log(event) });
  }

  handleShowNewRestaurantForm() {
    this.setState((state) => (
      { showNewRestaurantForm: !state.showNewRestaurantForm }
    ));
  }

  async handleAddRestaurant(newRestaurantName) {
    //this.props.addRestaurant(newRestaurantName);
    const metadata = {"type": "restaurant"};
    this.createRestaurant("", newRestaurantName, metadata);
  }

  render() {
    //const { restaurants } = this.props;
    const { showNewRestaurantForm, restaurants } = this.state;
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
        <RestaurantList restaurants={restaurants} />
      </div>
    )
  }
}

/*function mapStateToProps(state) {*/
  //return {
    //restaurants: state.restaurants,
  //}
//}

//const mapDispatchToProps = {
  //addRestaurant,
/*}*/

export default RestaurantListPage;
//export default connect(mapStateToProps, mapDispatchToProps)(RestaurantListPage);
