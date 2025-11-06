import axios from 'axios'

// Configure axios defaults - use environment variable or fallback to proxy
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:8080')
axios.defaults.baseURL = API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add response interceptor to handle errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axios
