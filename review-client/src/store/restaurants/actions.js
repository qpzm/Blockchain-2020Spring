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

export function fetchRestaurants(account, contract, pageSize, offset) {
  return async function(dispatch) {
    dispatch(fetchRestaurantsRequest());
    const restaurants = await fetchPosts(account, contract, 0, pageSize, offset);
    dispatch(fetchRestaurantsSuccess({restaurants}));
  }
}

export const FETCH_REVIEWS_REQUEST = 'FETCH_REVIEWS_REQUEST';
export const FETCH_REVIEWS_SUCCESS = 'FETCH_REVIEWS_SUCCESS';
export const FETCH_REVIEWS_FAILURE = 'FETCH_REVIEWS_FAILURE';

const fetchReviewsRequest = () => {
  return {
    type: FETCH_REVIEWS_REQUEST,
  }
}

const fetchReviewsSuccess = ({reviews, restaurantId}) => {
  return {
    type: FETCH_REVIEWS_SUCCESS,
    restaurantId,
    reviews,
  }
}

export function fetchReviews(account, contract, restaurantId, pageSize, offset) {
  return async function(dispatch) {
    dispatch(fetchReviewsRequest());
    const reviews = await fetchPosts(account, contract, restaurantId, pageSize, offset);
    dispatch(fetchReviewsSuccess({reviews, restaurantId}));
  }
}

async function fetchPosts(account, contract, parentId, pageSize=0, offset=0) {
  const postIds = await contract.methods
    .getIdsByParentId(parentId, pageSize, offset) // pageSize, offset
    .call({ from: account })

  const posts = await Promise.all(
    postIds.map(async (id) => {
      let post = await contract.methods.post(id).call({ from: account });
      post.id = id;
      try {
        post.metadata = JSON.parse(post.metadata);
      } catch(e) {
        post.metadata = "";
      }
      return post;
    })
  );

  return posts;
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
  const { body, title, metadata="", isImmutable } = data;
  data.metadata = JSON.stringify(metadata);

  return async function(dispatch) {
    dispatch(createRestaurantRequest());
    const restaurant = await createPost(account, contract, 0, data);
    dispatch(createRestaurantSuccess({restaurant}));
  }
}


export const CREATE_REVIEW_REQUEST = 'CREATE_REVIEW_REQUEST';
export const CREATE_REVIEW_SUCCESS = 'CREATE_REVIEW_SUCCESS';
export const CREATE_REVIEW_FAILURE = 'CREATE_REVIEW_FAILURE';

const createReviewRequest = () => {
  return {
    type: CREATE_REVIEW_REQUEST,
  }
};

const createReviewSuccess = ({review}) => {
  return {
    type: CREATE_REVIEW_SUCCESS,
    review,
  }
};

export function createReview(account, contract, restaurantId, body, points=3) {
  const metadata = JSON.stringify({ points });
  const data = { body, metadata };

  return async function(dispatch) {
    dispatch(createReviewRequest());
    const review = await createPost(account, contract, restaurantId, data);
    dispatch(createReviewSuccess({review}));
  }
}

async function createPost(account, contract, parentId, data) {
  const { body="", title="", metadata="", isImmutable=false } = data;

  await contract.methods
    .newPost(body, parentId, title, metadata, isImmutable)
    .send({ from: account })

  const id = await contract.methods
    .getIdsByAuthor(account, 1, 0) // pageSize, offset
    .call({ from: account })

  let post = await contract.methods
    .post(id)
    .call({ from: account })

  post.id = id;

  try {
    post.metadata = JSON.parse(post.metadata);
  } catch(e) {
    post.metadata = "";
  }

  return post;
}
