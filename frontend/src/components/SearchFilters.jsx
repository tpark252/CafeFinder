import React from 'react'
import { WifiIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/outline'

const SearchFilters = ({ filters, onFiltersChange }) => {
  const handleInputChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleCheckboxChange = (key) => {
    onFiltersChange({
      ...filters,
      [key]: !filters[key]
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      city: '',
      wifi: false,
      seating: false,
      workFriendly: false,
      priceRange: '',
      minRating: ''
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-coffee-600 hover:text-coffee-700"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter city name"
            className="input-field"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleInputChange('priceRange', e.target.value)}
            className="input-field"
          >
            <option value="">Any price</option>
            <option value="$">$ - Budget</option>
            <option value="$$">$$ - Moderate</option>
            <option value="$$$">$$$ - Expensive</option>
            <option value="$$$$">$$$$ - Very Expensive</option>
          </select>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <StarIcon className="inline h-4 w-4 mr-1" />
            Minimum Rating
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => handleInputChange('minRating', e.target.value)}
            className="input-field"
          >
            <option value="">Any rating</option>
            <option value="3">3+ stars</option>
            <option value="4">4+ stars</option>
            <option value="4.5">4.5+ stars</option>
          </select>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amenities
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.wifi}
                onChange={() => handleCheckboxChange('wifi')}
                className="rounded border-gray-300 text-coffee-600 focus:ring-coffee-500"
              />
              <WifiIcon className="h-4 w-4 ml-2 mr-1 text-gray-500" />
              <span className="text-sm text-gray-700">WiFi</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.seating}
                onChange={() => handleCheckboxChange('seating')}
                className="rounded border-gray-300 text-coffee-600 focus:ring-coffee-500"
              />
              <span className="ml-3 text-sm text-gray-700">Seating Available</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.workFriendly}
                onChange={() => handleCheckboxChange('workFriendly')}
                className="rounded border-gray-300 text-coffee-600 focus:ring-coffee-500"
              />
              <span className="ml-3 text-sm text-gray-700">Work-Friendly</span>
            </label>
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Filters
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleInputChange('minRating', '4')}
              className="px-3 py-1 text-xs rounded-full bg-coffee-100 text-coffee-700 hover:bg-coffee-200"
            >
              Highly Rated
            </button>
            <button
              onClick={() => {
                handleCheckboxChange('wifi')
                handleCheckboxChange('workFriendly')
              }}
              className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              Work-Friendly
            </button>
            <button
              onClick={() => handleInputChange('priceRange', '$')}
              className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 hover:bg-green-200"
            >
              Budget-Friendly
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
