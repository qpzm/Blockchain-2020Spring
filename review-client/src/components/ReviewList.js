import React from 'react';

const ReviewList = ({ reviews }) => (
  <ul>
    {
      reviews.map(review => (
        <li key={review.created}>
          {`body: ${review.body}`}
          {' '}
          {`points: ${review.metadata.points}`}
        </li>
      ))
    }
  </ul>
);

export default ReviewList;
