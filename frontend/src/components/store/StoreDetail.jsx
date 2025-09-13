import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storeAPI, ratingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Star, MapPin, MessageSquare } from 'lucide-react';
import RatingForm from "../store/RatingForm"

const StoreDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    fetchStoreData();
  }, [id]);

  const fetchStoreData = async () => {
    try {
      const [storeResponse, ratingsResponse] = await Promise.all([
        storeAPI.getStoreById(id),
        ratingAPI.getStoreRatings(id, { limit: 10 })
      ]);
      console.log('User ID:', user?.id);
      console.log('Ratings:', ratingsResponse.data.ratings);
      setStore(storeResponse.data);
      setRatings(ratingsResponse.data.ratings);
      
      // Check if user has already rated this store
      const existingRating = ratingsResponse.data.ratings.find(
        rating => rating.user_id === user?.id
      );
      setUserRating(existingRating);
    } catch (error) {
      console.error('Failed to fetch store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmitted = () => {
    setShowRatingForm(false);
    fetchStoreData(); // Refresh data
  };

  const StarRating = ({ rating, className = "" }) => {
    return (
      <div className={`flex items-center ${className}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Not Found</h2>
        <p className="text-gray-600">The store you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
  <div className="p-6 max-w-4xl mx-auto">
    {/* Store Header */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{store.name}</h1>
      <div className="flex items-center text-gray-600 mt-2">
        <MapPin className="w-5 h-5 mr-1" />
        <span>{store.location}</span>
      </div>
    </div>

    {/* Ratings Section */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Ratings</h2>
      {ratings.length === 0 ? (
        <p>No ratings yet.</p>
      ) : (
        ratings.map((rating) => (
          <div key={rating._id} className="border p-4 rounded mb-2">
            <div className="flex items-center mb-1">
              <StarRating rating={rating.score} />
              <span className="ml-2 font-medium">{rating.user.name}</span>
            </div>
            <p className="text-gray-700">{rating.comment}</p>
          </div>
        ))
      )}
    </div>

    {/* Rating Form Toggle */}
    {!userRating && user && (
      <button
        onClick={() => setShowRatingForm(true)}
        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
      >
        Leave a Rating
      </button>
    )}

    {/* Rating Form */}
    {showRatingForm && (
      <RatingForm
        storeId={id}
        storeName={store.name}
        onSubmitted={handleRatingSubmitted}
      />
    )}
  </div>
);
};

export default StoreDetail;