import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const AddCafe = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to add a café</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Café</h1>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">☕</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Café Submission Form</h3>
          <p className="text-gray-600 mb-4">
            Help grow the CafeFinder community by adding a new café.
          </p>
          <p className="text-sm text-gray-500">
            Full café submission form with location picker, amenities, and photo upload coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AddCafe
