import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from '../utils/api'
import { toast } from 'react-hot-toast'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const Admin = () => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('PENDING')
  const [selectedReview, setSelectedReview] = useState(null)
  const [moderationNote, setModerationNote] = useState('')

  useEffect(() => {
    fetchStats()
    fetchReviews()
  }, [filter])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/test-admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching admin stats:', error.response?.data || error)
      setStats({ totalReviews: 0, pendingReviews: 0, approvedReviews: 0, rejectedReviews: 0 })
    }
  }

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/test-admin/reviews?status=${filter}`)
      setReviews(response.data)
    } catch (error) {
      console.error('Error fetching reviews:', error.response?.data || error)
      setReviews([])
      toast.error('Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewModeration = async (reviewId, status) => {
    try {
      await axios.post(`/api/admin/reviews/${reviewId}/review`, {
        status,
        adminNotes: moderationNote
      })
      
      toast.success(`Review ${status.toLowerCase()} successfully!`)
      setSelectedReview(null)
      setModerationNote('')
      fetchReviews()
      fetchStats()
    } catch (error) {
      console.error('Error moderating review:', error.response?.data || error)
      toast.error('Failed to moderate review')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-yellow"><ClockIcon className="h-3 w-3 mr-1" />Pending</span>
      case 'APPROVED':
        return <span className="badge badge-green"><CheckCircleIcon className="h-3 w-3 mr-1" />Approved</span>
      case 'REJECTED':
        return <span className="badge badge-red"><XCircleIcon className="h-3 w-3 mr-1" />Rejected</span>
      default:
        return <span className="badge badge-gray">Unknown</span>
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  // Check if user is admin - do this after all hooks
  if (!user || !user.roles || !user.roles.includes('ADMIN')) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">Manage reviews and monitor platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalReviews || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingReviews || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approvedReviews || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejectedReviews || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === status
                    ? 'border-coffee-500 text-coffee-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status === 'ALL' ? 'All Reviews' : `${status.charAt(0) + status.slice(1).toLowerCase()} Reviews`}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center">
            <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">No {filter.toLowerCase()} reviews at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Review by {review.username}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(review.status)}
                    <div className="flex items-center">
                      {renderStars(review.overallRating)}
                      <span className="ml-2 text-sm text-gray-600">({review.overallRating}/5)</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">{review.text}</p>
                  {review.tasteNotes && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Taste Notes:</strong> {review.tasteNotes}
                    </p>
                  )}
                </div>

                {review.status === 'PENDING' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReviewModeration(review.id, 'APPROVED')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReview(review)
                        setModerationNote('')
                      }}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                )}

                {review.adminNotes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                    <p className="text-sm text-gray-600">{review.adminNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Review</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this review by {selectedReview.username}?
            </p>
            
            <div className="mb-4">
              <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                id="adminNotes"
                rows="3"
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedReview(null)
                  setModerationNote('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewModeration(selectedReview.id, 'REJECTED')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reject Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
