import React from 'react';

const RestaurantList = ({ restaurants }) => (
  <ul>
    {
      restaurants.map(restaurant => (
        <li key={restaurant.created}>
          {restaurant.title}
        </li>
      ))
    }
  </ul>
);

export default RestaurantList;
