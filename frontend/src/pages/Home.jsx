import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../utils/api'
import CafeCard from '../components/CafeCard'
import { MapPinIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'
import logo from '../assets/CafeFinder_Logo.png'

const Home = () => {
  const [popularCafes, setPopularCafes] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Test if backend is accessible first
        await axios.get('/api/health')
        
        // Get cafes from search endpoint since popular endpoint might not be working
        const cafesRes = await axios.get('/api/cafes/public/search')
        setPopularCafes(Array.isArray(cafesRes.data) ? cafesRes.data.slice(0, 6) : [])
        
        // Try to get reviews, but don't fail if it doesn't work
        try {
          const reviewsRes = await axios.get('/api/reviews/public/recent?limit=5')
          setRecentReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : [])
        } catch (reviewError) {
          console.log('Reviews endpoint not available yet - this is normal for a prototype')
          setRecentReviews([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        console.error('Make sure your backend is running on http://localhost:8080')
        
        // Set empty arrays as fallback
        setPopularCafes([])
        setRecentReviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="CafeFinder Logo" 
            className="h-40 w-auto mx-auto"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Find Your Perfect
          <span className="text-coffee-600"> Coffee Spot</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover amazing cafes, read honest reviews, and never wait in line again. 
          Join the community helping coffee lovers find their next favorite spot.
        </p>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/search" className="btn-primary text-lg px-8 py-3">
            Explore Cafes
          </Link>
          <Link to="/search?nearby=true" className="btn-secondary text-lg px-8 py-3">
            Find Nearby
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-coffee-600 mb-4">
            <MapPinIcon />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location-Based Search</h3>
          <p className="text-gray-600">Find cafes near you with GPS-powered search and detailed location info.</p>
        </div>
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-coffee-600 mb-4">
            <ClockIcon />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
          <p className="text-gray-600">Get live busy hours and wait times reported by the community.</p>
        </div>
        
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-coffee-600 mb-4">
            <StarIcon />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Honest Reviews</h3>
          <p className="text-gray-600">Read detailed reviews covering coffee quality, atmosphere, and amenities.</p>
        </div>
      </div>

      {/* Popular Cafes */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Cafes</h2>
          <Link to="/search" className="text-coffee-600 hover:text-coffee-700 font-medium">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCafes.map(cafe => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Reviews */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Reviews</h2>
          <Link to="/search" className="text-coffee-600 hover:text-coffee-700 font-medium">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentReviews.slice(0, 3).map(review => (
              <div key={review.id} className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-coffee-100 rounded-full flex items-center justify-center">
                      <span className="text-coffee-600 font-medium">
                        {review.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{review.username}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${i < review.overallRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
