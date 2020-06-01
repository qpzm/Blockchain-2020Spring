import getWeb3 from '../web3';
import NoncenseContract from '../../contracts/Noncense.js';

export const FETCH_CONTRACT_REQUEST = 'FETCH_CONTRACT_REQUEST';
export const FETCH_CONTRACT_SUCCESS = 'FETCH_CONTRACT_SUCCESS';
export const FETCH_CONTRACT_FAILURE = 'FETCH_CONTRACT_FAILURE';

const fetchContractRequest = () => {
  return {
    type: FETCH_CONTRACT_REQUEST,
  }
}

const fetchContractSuccess = ({ accounts, contract }) => {
  return {
    type: FETCH_CONTRACT_SUCCESS,
    accounts,
    contract,
  }
}

export function fetchContract() {
  return async function (dispatch) {
    dispatch(fetchContractRequest())

    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = NoncenseContract.networks[networkId];
    const contract = new web3.eth.Contract(
      NoncenseContract.abi,
      deployedNetwork && deployedNetwork.address,
    );

    dispatch(fetchContractSuccess({
      accounts,
      contract,
    }));
  }
}


export const FETCH_RESTAURANTS_REQUEST = 'FETCH_RESTAURANTS_REQUEST';
export const FETCH_RESTAURANTS_SUCCESS = 'FETCH_RESTAURANTS_SUCCESS';
export const FETCH_RESTAURANTS_FAILURE = 'FETCH_RESTAURANTS_FAILURE';

const fetchRestaurantsRequest = () => {
  return {
    type: FETCH_RESTAURANTS_REQUEST,
  }
}

const fetchRestaurantsSuccess = ({restaurants}) => {
  return {
    type: FETCH_RESTAURANTS_SUCCESS,
    restaurants,
  }
}

export function fetchRestaurants(account, contract, pageSize=0, offset=0) {
  return async function(dispatch) {
    dispatch(fetchRestaurantsRequest());
    const parentId = 0;

    const restaurantIds = await contract.methods
      .getIdsByParentId(parentId, pageSize, offset) // pageSize, offset
      .call({ from: account })
    Promise.all(
      restaurantIds.map(async (id) => (
        await contract.methods.post(id).call({ from: account })
          .then((restaurant) => {
            restaurant.id = id;
            try {
              restaurant.metadata = JSON.parse(restaurant.metadata);
            } catch(e) {
              restaurant.metadata = "";
            }
            return restaurant;
          })
      ))
    ).then((restaurants) => {
      dispatch(fetchRestaurantsSuccess({restaurants}));
    });
  }
}


export const CREATE_RESTAURANT_REQUEST = 'CREATE_RESTAURANT_REQUEST';
export const CREATE_RESTAURANT_SUCCESS = 'CREATE_RESTAURANT_SUCCESS';
export const CREATE_RESTAURANT_FAILURE = 'CREATE_RESTAURANT_FAILURE';

const createRestaurantRequest = () => {
  return {
    type: CREATE_RESTAURANT_REQUEST,
  }
};

const createRestaurantSuccess = ({restaurant}) => {
  return {
    type: CREATE_RESTAURANT_SUCCESS,
    restaurant,
  }
};

export function createRestaurant(account, contract, data) {
  return async function(dispatch) {
    dispatch(createRestaurantRequest());
    const { content="", title="", metadata={"type": "restaurant"}, isImmutable=false } = data;
    const parentId = 0;
    const metadataStr = JSON.stringify(metadata);
    contract.methods
      .newPost(content, parentId, title, metadataStr, isImmutable)
      .send({ from: account })
      .then((receipt) => {
        // set pseudo created because it is the key in <li>
        const restaurant = {...data, parentId, created: 0 };
        dispatch(createRestaurantSuccess({restaurant}));
      });
  }
}
