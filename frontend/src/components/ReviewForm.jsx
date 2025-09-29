import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from '../utils/api'
import toast from 'react-hot-toast'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { CameraIcon } from '@heroicons/react/24/outline'

const ReviewForm = ({ cafeId, onReviewSubmitted }) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    overallRating: 0,
    coffeeRating: 0,
    tasteRating: 0,
    ambianceRating: 0,
    serviceRating: 0,
    valueRating: 0,
    text: '',
    tasteNotes: '',
    wifi: null,
    seating: null,
    workFriendly: null,
    bathrooms: null,
    petFriendly: null,
    parking: '',
    priceRange: '',
    waitTime: ''
  })

  const ratingCategories = [
    { key: 'overallRating', label: 'Overall', required: true },
    { key: 'coffeeRating', label: 'Coffee Quality' },
    { key: 'tasteRating', label: 'Taste' },
    { key: 'ambianceRating', label: 'Ambiance' },
    { key: 'serviceRating', label: 'Service' },
    { key: 'valueRating', label: 'Value' }
  ]

  const handleRatingChange = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      [category]: rating
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.overallRating === 0) {
      toast.error('Please provide an overall rating')
      return
    }

    setLoading(true)
    try {
      const reviewData = {
        ...formData,
        cafeId,
        waitTime: formData.waitTime ? parseInt(formData.waitTime) : null
      }

      const response = await axios.post('/api/reviews', reviewData)
      toast.success('Review submitted successfully!')
      onReviewSubmitted?.(response.data)
      setIsOpen(false)
      setFormData({
        overallRating: 0,
        coffeeRating: 0,
        tasteRating: 0,
        ambianceRating: 0,
        serviceRating: 0,
        valueRating: 0,
        text: '',
        tasteNotes: '',
        wifi: null,
        seating: null,
        workFriendly: null,
        bathrooms: null,
        petFriendly: null,
        parking: '',
        priceRange: '',
        waitTime: ''
      })
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStarRating = (category, current) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className="focus:outline-none"
          >
            {star <= current ? (
              <StarIconSolid className="h-6 w-6 text-yellow-400" />
            ) : (
              <StarIcon className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {current > 0 ? `${current}/5` : 'Not rated'}
        </span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="card text-center">
        <p className="text-gray-600 mb-4">Please log in to write a review</p>
        <button className="btn-primary">Log In</button>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="card">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full btn-primary"
        >
          Write a Review
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Write a Review</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ratings */}
        <div>
          <h4 className="text-lg font-medium mb-4">Ratings</h4>
          <div className="space-y-4">
            {ratingCategories.map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {renderStarRating(key, formData[key])}
              </div>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            rows={4}
            className="input-field"
            placeholder="Share your experience..."
          />
        </div>

        {/* Taste Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coffee Taste Notes
          </label>
          <textarea
            value={formData.tasteNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, tasteNotes: e.target.value }))}
            rows={2}
            className="input-field"
            placeholder="Describe the coffee flavors, roast, etc."
          />
        </div>

        {/* Amenities Verification */}
        <div>
          <h4 className="text-lg font-medium mb-4">Verify Amenities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'wifi', label: 'WiFi Available' },
              { key: 'seating', label: 'Seating Available' },
              { key: 'workFriendly', label: 'Work-Friendly' },
              { key: 'bathrooms', label: 'Bathrooms Available' },
              { key: 'petFriendly', label: 'Pet-Friendly' }
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={key}
                      checked={formData[key] === true}
                      onChange={() => setFormData(prev => ({ ...prev, [key]: true }))}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={key}
                      checked={formData[key] === false}
                      onChange={() => setFormData(prev => ({ ...prev, [key]: false }))}
                      className="mr-2"
                    />
                    No
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={key}
                      checked={formData[key] === null}
                      onChange={() => setFormData(prev => ({ ...prev, [key]: null }))}
                      className="mr-2"
                    />
                    N/A
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parking
            </label>
            <select
              value={formData.parking}
              onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.value }))}
              className="input-field"
            >
              <option value="">Not specified</option>
              <option value="street">Street parking</option>
              <option value="lot">Parking lot</option>
              <option value="free_lot">Free parking lot</option>
              <option value="paid_lot">Paid parking lot</option>
              <option value="none">No parking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <select
              value={formData.priceRange}
              onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
              className="input-field"
            >
              <option value="">Not specified</option>
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Expensive</option>
              <option value="$$$$">$$$$ - Very Expensive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wait Time (minutes)
            </label>
            <input
              type="number"
              value={formData.waitTime}
              onChange={(e) => setFormData(prev => ({ ...prev, waitTime: e.target.value }))}
              className="input-field"
              placeholder="0"
              min="0"
              max="120"
            />
          </div>
        </div>

        {/* Photo Upload Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Photo upload coming soon</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading || formData.overallRating === 0}
            className="btn-primary flex-1"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
