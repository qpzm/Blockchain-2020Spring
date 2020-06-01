import React from 'react';
import { useParams } from "react-router-dom";

const RestaurantDetailPage = () => {
  const { restaurantId } = useParams();
  console.log(restaurantId);
  return (
    <div>
      <h3>Restaurant {restaurantId}</h3>
    </div>
  )
};

export default RestaurantDetailPage;
