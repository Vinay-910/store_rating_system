// src/components/user/UserRatings.js
import React, { useState, useEffect } from 'react';
import { ratingAPI } from '../../services/api';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import { RATING_LABELS } from '../../utils/constants';

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchUserRatings();
  }, []);

  const fetchUserRatings = async () => {
    try {
      const response = await ratingAPI.getUserRatings();
      setRatings(response.data.ratings);
    } catch (error) {
      console.error('Failed to fetch user ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      setDeleteLoading(ratingId);
      await ratingAPI.deleteRating(ratingId);
      setRatings(ratings.filter(rating => rating._id !== ratingId));
    } catch (error) {
      console.error('Failed to delete rating:', error);
      alert('Failed to delete rating. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating 
              ? 'text-yellow-500 fill-current' 
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Ratings</h1>

      {ratings.length > 0 ? (
        <div className="space-y-6">
          {ratings.map((rating) => (
            <div key={rating._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {rating.store_name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <StarRating rating={rating.rating} />
                    <span className="text-sm font-medium text-gray-700">
                      {RATING_LABELS[rating.rating]}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteRating(rating._id)}
                  disabled={deleteLoading === rating._id}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete Rating"
                >
                  {deleteLoading === rating._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {rating.review && (
                <div className="border-t pt-4">
                  <p className="text-gray-700 leading-relaxed">{rating.review}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Ratings Yet</h2>
          <p className="text-gray-600 mb-6">You haven't rated any stores yet.</p>
          <a href="/stores" className="btn-primary">
            Browse Stores
          </a>
        </div>
      )}
    </div>
  );
};

export default UserRatings;