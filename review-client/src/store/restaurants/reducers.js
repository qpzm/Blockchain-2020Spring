import * as actions from './actions';

const initalState = {
  isFetching: false,
  restaurants: [],
  reviews: {},
  web3: null,
  accounts: null,
  contract: null,
};

const restaurants = (state = initalState, action) => {
  switch(action.type) {
    case actions.FETCH_CONTRACT_REQUEST:
    case actions.CREATE_RESTAURANT_REQUEST:
    case actions.FETCH_RESTAURANTS_REQUEST:
    case actions.FETCH_REVIEWS_REQUEST:
    case actions.CREATE_REVIEW_REQUEST:
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
    case actions.FETCH_REVIEWS_SUCCESS:
      return Object.assign({}, state, {
        // New value should follow the old value with the same key.
        reviews: {
          ...state.reviews,
          [action.restaurantId]: action.reviews,
        }
      });
    case actions.CREATE_REVIEW_SUCCESS:
      return Object.assign({}, state, {
        reviews: {
          ...state.reviews,
          [action.review.parentId]: [
            action.review,
            ...state.reviews[action.review.parentId]
          ],
        }
      });
    default:
      return state;
  }
}

export default restaurants;
