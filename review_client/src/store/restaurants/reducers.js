import * as actions from './actions'

const initalState = [
  'Burger Place',
];

export default function restaurants(state = initalState, action) {
  switch(action.type) {
    case actions.ADD_RESTAURANT:
      return [
        action.name,
        ...state,
      ]
    default:
      return state;
  }
}
