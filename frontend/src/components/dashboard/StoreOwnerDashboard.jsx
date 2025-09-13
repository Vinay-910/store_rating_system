import React, { useState, useEffect } from 'react';
import { Store, Star, Users } from 'lucide-react';
import { storeOwnerAPI } from '../../services/api';

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [ratingsData, setRatingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [storeResponse, ratingsResponse] = await Promise.all([
          storeOwnerAPI.getOwnerStore(),
          storeOwnerAPI.getStoreRatings({ limit: 5 })
        ]);

        setStoreData(storeResponse.data.store);
        setRatingsData(ratingsResponse.data);
      } catch (error) {
        console.error('Failed to fetch store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="text-center py-12">
        <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No store found for your account</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Store Owner Dashboard</h1>
      
      {/* Store Info */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Store</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Store Name</p>
            <p className="text-lg text-gray-900">{storeData.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="text-lg text-gray-900">{storeData.email}</p>
          </div>
        </div>
        {storeData.address && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">Address</p>
            <p className="text-lg text-gray-900">{storeData.address}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {storeData.average_rating ? Number(storeData.average_rating).toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ratings</p>
              <p className="text-2xl font-bold text-gray-900">{storeData.total_ratings || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ratings */}
      {ratingsData.ratings && ratingsData.ratings.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Ratings</h3>
          <div className="space-y-3">
            {ratingsData.ratings.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{rating.user_name}</p>
                  <p className="text-sm text-gray-500">{rating.user_email}</p>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= rating.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({rating.rating})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;