import * as actions from './actions';

const initalState = {
  isFetching: false,
  restaurants: [],
  web3: null,
  accounts: null,
  contract: null,
};

const restaurants = (state = initalState, action) => {
  switch(action.type) {
    case actions.FETCH_CONTRACT_REQUEST:
    case actions.CREATE_RESTAURANT_REQUEST:
    case actions.FETCH_RESTAURANTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case actions.FETCH_CONTRACT_SUCCESS:
      return Object.assign({}, state, {
        accounts: action.accounts,
        contract: action.contract,
      });
    case actions.FETCH_RESTAURANTS_SUCCESS:
      return Object.assign({}, state, {
        restaurants: action.restaurants,
      });
    case actions.CREATE_RESTAURANT_SUCCESS:
      return Object.assign({}, state, {
        restaurants: [
          action.restaurant,
          ...state.restaurants,
        ]
      });
    default:
      return state;
  }
}

export default restaurants;
