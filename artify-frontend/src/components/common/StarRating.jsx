import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export const StarRating = ({ rating = 0, onRate, readonly = true, size = 16 }) => {
  const stars = [];

  const handleRate = (index) => {
    if (!readonly && onRate) {
      onRate(index);
    }
  };

  if (readonly) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} size={size} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} size={size} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} size={size} className="text-muted opacity-50" />);
      }
    }
  } else {
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          onClick={() => handleRate(i)}
          className="cursor-pointer"
        >
          {i <= rating ? (
            <FaStar size={size} className="text-warning" />
          ) : (
            <FaRegStar size={size} className="text-muted" />
          )}
        </span>
      );
    }
  }

  return <div className="d-inline-flex gap-1">{stars}</div>;
};

export default StarRating;
