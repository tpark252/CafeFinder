import React from 'react'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { HandThumbUpIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'

const ReviewList = ({ reviews = [] }) => {
  const renderStars = (rating) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          i < rating ? (
            <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon key={i} className="h-4 w-4 text-gray-300" />
          )
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  }

  const getBadgeColor = (value) => {
    if (value === true) return 'badge-green'
    if (value === false) return 'badge-red'
    return 'badge-gray'
  }

  const getBadgeText = (value) => {
    if (value === true) return 'Yes'
    if (value === false) return 'No'
    return 'N/A'
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this cafe!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Reviews ({reviews.length})</h3>
      
      {reviews.map((review) => (
        <div key={review.id} className="border border-gray-200 rounded-lg p-6">
          {/* Review Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-coffee-100 rounded-full flex items-center justify-center">
                <span className="text-coffee-600 font-medium">
                  {review.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{review.username}</span>
                  {review.verified && (
                    <CheckBadgeIcon className="h-4 w-4 text-blue-500" title="Verified visit" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{formatDate(review.createdAt)}</span>
                  {review.waitTime && (
                    <span>• Wait time: {review.waitTime} min</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              {renderStars(review.overallRating)}
            </div>
          </div>

          {/* Detailed Ratings */}
          {(review.coffeeRating || review.tasteRating || review.ambianceRating || 
            review.serviceRating || review.valueRating) && (
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                {review.coffeeRating && (
                  <div>
                    <span className="text-gray-600">Coffee:</span>
                    <div className="flex items-center mt-1">
                      {renderStars(review.coffeeRating)}
                    </div>
                  </div>
                )}
                {review.tasteRating && (
                  <div>
                    <span className="text-gray-600">Taste:</span>
                    <div className="flex items-center mt-1">
                      {renderStars(review.tasteRating)}
                    </div>
                  </div>
                )}
                {review.ambianceRating && (
                  <div>
                    <span className="text-gray-600">Ambiance:</span>
                    <div className="flex items-center mt-1">
                      {renderStars(review.ambianceRating)}
                    </div>
                  </div>
                )}
                {review.serviceRating && (
                  <div>
                    <span className="text-gray-600">Service:</span>
                    <div className="flex items-center mt-1">
                      {renderStars(review.serviceRating)}
                    </div>
                  </div>
                )}
                {review.valueRating && (
                  <div>
                    <span className="text-gray-600">Value:</span>
                    <div className="flex items-center mt-1">
                      {renderStars(review.valueRating)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Review Text */}
          {review.text && (
            <div className="mb-4">
              <p className="text-gray-700">{review.text}</p>
            </div>
          )}

          {/* Taste Notes */}
          {review.tasteNotes && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-1">Coffee Notes:</h5>
              <p className="text-gray-700 italic">"{review.tasteNotes}"</p>
            </div>
          )}

          {/* Amenities Verification */}
          {(review.wifi !== null || review.seating !== null || review.workFriendly !== null || 
            review.bathrooms !== null || review.petFriendly !== null || review.parking || 
            review.priceRange) && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Verified Info:</h5>
              <div className="flex flex-wrap gap-2">
                {review.wifi !== null && (
                  <span className={`badge ${getBadgeColor(review.wifi)}`}>
                    WiFi: {getBadgeText(review.wifi)}
                  </span>
                )}
                {review.seating !== null && (
                  <span className={`badge ${getBadgeColor(review.seating)}`}>
                    Seating: {getBadgeText(review.seating)}
                  </span>
                )}
                {review.workFriendly !== null && (
                  <span className={`badge ${getBadgeColor(review.workFriendly)}`}>
                    Work-friendly: {getBadgeText(review.workFriendly)}
                  </span>
                )}
                {review.bathrooms !== null && (
                  <span className={`badge ${getBadgeColor(review.bathrooms)}`}>
                    Bathrooms: {getBadgeText(review.bathrooms)}
                  </span>
                )}
                {review.petFriendly !== null && (
                  <span className={`badge ${getBadgeColor(review.petFriendly)}`}>
                    Pet-friendly: {getBadgeText(review.petFriendly)}
                  </span>
                )}
                {review.parking && (
                  <span className="badge badge-blue">
                    Parking: {review.parking.replace('_', ' ')}
                  </span>
                )}
                {review.priceRange && (
                  <span className="badge badge-green">
                    Price: {review.priceRange}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Review Actions */}
          <div className="flex items-center space-x-4 text-sm">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <HandThumbUpIcon className="h-4 w-4" />
              <span>Helpful ({review.helpfulVotes || 0})</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <span>👍 {review.likes || 0}</span>
            </button>
            {review.photos && review.photos.length > 0 && (
              <span className="text-gray-500">
                📷 {review.photos.length} photo{review.photos.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
