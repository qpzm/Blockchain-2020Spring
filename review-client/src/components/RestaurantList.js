import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantList = ({ restaurants }) => (
  <ul>
    {
      restaurants.map(restaurant => (
        <li key={restaurant.created}>
          <Link to={`/restaurants/${restaurant.id}`}>
            {restaurant.title}
          </Link>
        </li>
      ))
    }
  </ul>
);

export default RestaurantList;
