import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from '../utils/api'
import CafeCard from '../components/CafeCard'
import CafeMap from '../components/CafeMap'
import SearchFilters from '../components/SearchFilters'
import { MagnifyingGlassIcon, MapIcon, ViewColumnsIcon } from '@heroicons/react/24/outline'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [cafes, setCafes] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'map'
  const [selectedCafe, setSelectedCafe] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    wifi: searchParams.get('wifi') === 'true' || false,
    seating: searchParams.get('seating') === 'true' || false,
    workFriendly: searchParams.get('workFriendly') === 'true' || false,
    priceRange: searchParams.get('priceRange') || '',
    minRating: searchParams.get('minRating') || ''
  })

  useEffect(() => {
    searchCafes()
  }, [searchParams])

  useEffect(() => {
    // Get user's location for map centering
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          // Default to Atlanta if location access denied
          setUserLocation({ lat: 33.7490, lng: -84.3880 })
        }
      )
    } else {
      setUserLocation({ lat: 33.7490, lng: -84.3880 })
    }
  }, [])

  const searchCafes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('q', searchQuery)
      if (filters.city) params.append('city', filters.city)
      if (filters.wifi) params.append('wifi', 'true')
      if (filters.seating) params.append('seating', 'true')
      if (filters.workFriendly) params.append('workFriendly', 'true')
      if (filters.priceRange) params.append('priceRange', filters.priceRange)
      if (filters.minRating) params.append('minRating', filters.minRating)

      // Check if user wants nearby cafes
      if (searchParams.get('nearby') === 'true') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              params.append('lat', position.coords.latitude.toString())
              params.append('lng', position.coords.longitude.toString())
              params.append('radius', '10')
              
              const response = await axios.get(`/api/cafes/public/search?${params}`)
              setCafes(response.data)
              setLoading(false)
            },
            () => {
              // Fallback to regular search if location access denied
              const response = axios.get(`/api/cafes/public/search?${params}`)
              setCafes(response.data)
              setLoading(false)
            }
          )
          return
        }
      }

      const response = await axios.get(`/api/cafes/public/search?${params}`)
      setCafes(response.data)
    } catch (error) {
      console.error('Error searching cafes:', error)
      setCafes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateSearchParams()
  }

  const updateSearchParams = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (filters.city) params.set('city', filters.city)
    if (filters.wifi) params.set('wifi', 'true')
    if (filters.seating) params.set('seating', 'true')
    if (filters.workFriendly) params.set('workFriendly', 'true')
    if (filters.priceRange) params.set('priceRange', filters.priceRange)
    if (filters.minRating) params.set('minRating', filters.minRating)
    
    setSearchParams(params)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    // Auto-search when filters change
    setTimeout(updateSearchParams, 100)
  }

  const calculateMapCenter = () => {
    if (!cafes || cafes.length === 0) return userLocation || { lat: 33.7490, lng: -84.3880 }
    
    if (cafes.length === 1) {
      return { lat: cafes[0].latitude, lng: cafes[0].longitude }
    }

    // Calculate center of all cafes
    const avgLat = cafes.reduce((sum, cafe) => sum + cafe.latitude, 0) / cafes.length
    const avgLng = cafes.reduce((sum, cafe) => sum + cafe.longitude, 0) / cafes.length
    
    return { lat: avgLat, lng: avgLng }
  }

  const handleCafeSelect = (cafe) => {
    setSelectedCafe(cafe)
    // Navigate to cafe details page
    navigate(`/cafe/${cafe.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Café</h1>
        
        <form onSubmit={handleSearch} className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cafes, neighborhoods..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <SearchFilters filters={filters} onFiltersChange={handleFilterChange} />
        </div>

        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {cafes?.length || 0} cafes found
                </h2>
                
                {/* View Toggle */}
                <div className="flex rounded-lg border border-gray-300">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                      viewMode === 'grid'
                        ? 'bg-coffee-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ViewColumnsIcon className="h-4 w-4 inline mr-1" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l ${
                      viewMode === 'map'
                        ? 'bg-coffee-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <MapIcon className="h-4 w-4 inline mr-1" />
                    Map
                  </button>
                </div>
              </div>
              
              {(!cafes || cafes.length === 0) ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">☕</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cafes found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cafes.map(cafe => (
                    <CafeCard key={cafe.id} cafe={cafe} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Map View */}
                  <div className="h-96">
                    <CafeMap
                      cafes={cafes}
                      center={calculateMapCenter()}
                      zoom={cafes.length === 1 ? 15 : 12}
                      onCafeSelect={handleCafeSelect}
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                  
                  {/* Selected Cafe Details */}
                  {selectedCafe && (
                    <div className="card">
                      <h4 className="text-lg font-semibold mb-2">{selectedCafe.name}</h4>
                      <p className="text-gray-600 mb-4">
                        {selectedCafe.address}, {selectedCafe.city}, {selectedCafe.state}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">⭐</span>
                          <span>{selectedCafe.avgRating?.toFixed(1) || '0.0'}</span>
                          <span className="text-gray-500 ml-1">
                            ({selectedCafe.reviewsCount || 0} reviews)
                          </span>
                        </div>
                        <a
                          href={`/cafe/${selectedCafe.id}`}
                          className="btn-primary"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Cafe List Below Map */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cafes.map(cafe => (
                      <div
                        key={cafe.id}
                        className={`cursor-pointer transition-all ${
                          selectedCafe?.id === cafe.id ? 'ring-2 ring-coffee-500' : ''
                        }`}
                        onClick={() => handleCafeSelect(cafe)}
                      >
                        <CafeCard cafe={cafe} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
