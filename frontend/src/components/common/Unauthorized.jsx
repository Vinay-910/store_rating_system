import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Shield className="h-16 w-16 text-red-400 mx-auto" />
        <h1 className="text-2xl font-semibold text-gray-900 mt-4">Access Denied</h1>
        <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="h-4 w-4 mr-2" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;