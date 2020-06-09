import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import {
  fetchContract,
  fetchReviews,
  createReview,
} from '../store/restaurants/actions';
import NewReviewForm from './NewReviewForm'
import ReviewList from './ReviewList'

class RestaurantDetailPage extends Component {
  componentDidMount = async () => {
    const {
      match: {
        params: { restaurantId }
      }
    } = this.props;

    if(this.props.contract === null) {
      await this.props.fetchContract();
    }
    const { accounts, contract } = this.props;
    this.props.fetchReviews(accounts[0], contract, restaurantId);
  }

  handleCreateReview = (body, points) => {
    const {
      match: {
        params: { restaurantId }
      },
      accounts,
      contract,
    } = this.props;

    this.props.createReview(accounts[0], contract, restaurantId, body, points);
  }

  render() {
    const {
      match: {
        params: { restaurantId }
      },
      reviews,
    } = this.props;
    return (
      <div>
        <h3>Restaurant {restaurantId}</h3>
        <NewReviewForm
          onSave={this.handleCreateReview}
        />
        <ReviewList reviews={reviews[restaurantId] || []} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  /*const {*/
    //match: {
      //params: { restaurantId }
    //}
  //} = ownProps;

  return {
    //restaurant: state.restaurants.filter((r) => (r.id === restaurantId))[0],
    reviews: state.restaurants.reviews,
    accounts: state.restaurants.accounts,
    contract: state.restaurants.contract,
  }
}

const mapDispatchToProps = {
  fetchContract,
  fetchReviews,
  createReview,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RestaurantDetailPage));
