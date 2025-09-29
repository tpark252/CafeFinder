import { useState, useEffect } from 'react'

// Custom hook to fetch Google Places photos for cafes
const useGooglePhoto = (cafe, options = {}) => {
  const { 
    maxWidth = 400, 
    maxHeight = 300, 
    isBanner = false 
  } = options
  const [photoUrl, setPhotoUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!cafe || !window.google?.maps?.places) {
      setLoading(false)
      return
    }

    const fetchPhoto = async () => {
      try {
        setLoading(true)
        setError(null)

        // Create a service if it doesn't exist
        if (!window.placesService) {
          // Create a dummy div for the service
          const dummyDiv = document.createElement('div')
          window.placesService = new window.google.maps.places.PlacesService(dummyDiv)
        }

        // Set a timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          setLoading(false)
          setError('Timeout fetching photo')
        }, 5000)

        const request = {
          query: `${cafe.name} ${cafe.address} ${cafe.city}`,
          fields: ['place_id', 'photos', 'name'],
          locationBias: {
            center: { lat: cafe.latitude, lng: cafe.longitude },
            radius: 100 // 100 meter radius
          }
        }

        window.placesService.textSearch(request, (results, status) => {
          clearTimeout(timeoutId)
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            const place = results[0]
            if (place.photos && place.photos.length > 0) {
              try {
                // Get the first photo with appropriate size
                const photoSize = isBanner ? {
                  maxWidth: 800,
                  maxHeight: 400
                } : {
                  maxWidth,
                  maxHeight
                }
                
                const photo = place.photos[0].getUrl(photoSize)
                setPhotoUrl(photo)
              } catch (photoError) {
                console.log('Error getting photo URL:', photoError)
                setError('Failed to load photo')
              }
            } else {
              setError('No photos available')
            }
          } else {
            console.log('Places API error for', cafe.name, ':', status)
            setError('Place not found')
          }
          setLoading(false)
        })
      } catch (err) {
        console.error('Error fetching Google photo:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    // Small delay to ensure Google Maps is loaded
    const delayTimeout = setTimeout(fetchPhoto, 100)
    
    return () => {
      clearTimeout(delayTimeout)
    }
  }, [cafe])

  return { photoUrl, loading, error }
}

export default useGooglePhoto
