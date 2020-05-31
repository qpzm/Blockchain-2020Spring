import React from 'react';

const RestaurantList = ({ restaurantNames }) => (
  <ul>
    {
      restaurantNames.map(restaurantName => (
        <li key={restaurantName}>
          {restaurantName}
        </li>
      ))
    }
  </ul>
);

export default RestaurantList;
