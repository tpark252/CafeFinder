import React, { useState } from 'react'
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import axios from '../utils/api'
import toast from 'react-hot-toast'

const ClaimCafeModal = ({ cafe, isOpen, onClose, onClaimSubmitted }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    businessEmail: '',
    businessPhone: '',
    ownerName: '',
    ownerTitle: '',
    reason: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axios.post('/api/claims/request', {
        cafeId: cafe.id,
        ...formData
      })
      
      toast.success('Claim request submitted successfully! We\'ll review it within 3-5 business days.')
      onClaimSubmitted?.()
      onClose()
      
      // Reset form
      setFormData({
        businessEmail: '',
        businessPhone: '',
        ownerName: '',
        ownerTitle: '',
        reason: ''
      })
    } catch (error) {
      console.error('Error submitting claim:', error)
      toast.error(error.response?.data || 'Failed to submit claim request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Claim This Business</h2>
            <p className="text-sm text-gray-600 mt-1">{cafe.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Verification Process</p>
                <p>To claim this business, you'll need to provide verification that you're authorized to manage this listing. We typically review claims within 3-5 business days.</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Email */}
            <div>
              <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Business Email Address *
              </label>
              <input
                type="email"
                id="businessEmail"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="your.email@yourbusiness.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll use this to verify your connection to the business
              </p>
            </div>

            {/* Business Phone */}
            <div>
              <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Business Phone Number *
              </label>
              <input
                type="tel"
                id="businessPhone"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Full Name *
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="John Smith"
              />
            </div>

            {/* Owner Title */}
            <div>
              <label htmlFor="ownerTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Your Title/Role *
              </label>
              <input
                type="text"
                id="ownerTitle"
                name="ownerTitle"
                value={formData.ownerTitle}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Owner, Manager, Marketing Director, etc."
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Why should you be able to claim this business?
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Explain your relationship to this business and why you should be able to manage its listing..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Provide additional context about your role or ownership
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClaimCafeModal
