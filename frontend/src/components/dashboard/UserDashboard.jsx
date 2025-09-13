import React, { useState, useEffect } from 'react';
import { Star, Store, TrendingUp } from 'lucide-react';
import { storeAPI, ratingAPI } from '../../services/api';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalStores: 0,
    userRatings: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [storesResponse, ratingsResponse] = await Promise.all([
          storeAPI.getAllStores({ limit: 1 }),
          ratingAPI.getUserRatings({ limit: 5 }),
        ]);

        setStats({
          totalStores: storesResponse.data.pagination?.totalCount || 0,
          userRatings: ratingsResponse.data.pagination?.totalCount || 0,
          averageRating: ratingsResponse.data.ratings?.length > 0 
            ? ratingsResponse.data.ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratingsResponse.data.ratings.length
            : 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stores</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStores}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Your Ratings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.userRatings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating Given</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;