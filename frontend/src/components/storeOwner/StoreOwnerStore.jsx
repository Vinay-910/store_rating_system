// /src/components/storeOwner/StoreOwnerStore.js
import React, { useState, useEffect } from 'react';
import { storeOwnerAPI, storeAPI } from '../../services/api';
import { Store, Edit2, Star, MapPin, Users } from 'lucide-react';
import { validateName, validateAddress } from '../../utils/validation';

const StoreOwnerStore = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const response = await storeOwnerAPI.getOwnerStore();
      setStore(response.data);
      setFormData({
        name: response.data.name,
        address: response.data.address,
        description: response.data.description || ''
      });
    } catch (error) {
      if (error.response?.status === 404) {
        // Store doesn't exist, show create form
        setEditMode(true);
      } else {
        console.error('Failed to fetch store:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const addressError = validateAddress(formData.address);
    if (addressError) newErrors.address = addressError;
    
    if (formData.description && formData.description.length > 400) {
      newErrors.description = 'Description must not exceed 400 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      if (store) {
        // Update existing store
        const response = await storeAPI.updateStore(store._id, formData);
        setStore(response.data);
      } else {
        // Create new store
        const response = await storeAPI.createStore(formData);
        setStore(response.data);
      }
      
      setEditMode(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to save store:', error);
      alert('Failed to save store. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {store ? 'My Store' : 'Register Your Store'}
        </h1>
        {store && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="btn-primary"
          >
            <Edit2 className="h-5 w-5 mr-2" />
            Edit Store
          </button>
        )}
      </div>

      {editMode ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'border-red-300' : ''}`}
                  placeholder="Enter store name (20-60 characters)"
                  required
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-input ${errors.address ? 'border-red-300' : ''}`}
                  placeholder="Enter store address (max 400 characters)"
                  required
                />
                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                <p className="text-sm text-gray-500 mt-1">{formData.address.length}/400 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={`form-input ${errors.description ? 'border-red-300' : ''}`}
                  placeholder="Describe your store (max 400 characters)"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                <p className="text-sm text-gray-500 mt-1">{formData.description.length}/400 characters</p>
              </div>

              <div className="flex items-center justify-end space-x-3">
                {store && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: store.name,
                        address: store.address,
                        description: store.description || ''
                      });
                      setErrors({});
                    }}
                    className="btn-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : store ? 'Update Store' : 'Register Store'}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : store ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h2>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-5 w-5 mr-2" />
                <p>{store.address}</p>
              </div>
              {store.description && (
                <p className="text-gray-700">{store.description}</p>
              )}
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
                <Star className="h-6 w-6 text-yellow-500 fill-current mr-2" />
                <span className="text-2xl font-semibold">
                  {store.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{store.totalRatings || 0} ratings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{store.totalRatings || 0}</div>
              <div className="text-sm text-gray-600">Total Ratings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{store.averageRating?.toFixed(1) || '0.0'}</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Active</div>
              <div className="text-sm text-gray-600">Store Status</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Store Registered</h2>
          <p className="text-gray-600 mb-6">Register your store to start receiving ratings from customers.</p>
          <button
            onClick={() => setEditMode(true)}
            className="btn-primary"
          >
            Register Your Store
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerStore;