import React, { useState, useEffect } from 'react'
import axios from '../utils/api'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

const Status = () => {
  const [status, setStatus] = useState({
    backend: 'checking',
    database: 'checking',
    authentication: 'checking',
    cafes: 'checking',
    reviews: 'checking'
  })
  const [testResults, setTestResults] = useState([])

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date() }])
    setStatus(prev => ({ ...prev, [test]: success ? 'success' : 'error' }))
  }

  useEffect(() => {
    const runTests = async () => {
      // Test 1: Backend Health
      try {
        await axios.get('/api/health')
        addTestResult('backend', true, 'Backend is responding')
        
        // Test 2: Database/Cafes
        try {
          const cafesRes = await axios.get('/api/cafes/public/search')
          if (cafesRes.data && cafesRes.data.length > 0) {
            addTestResult('database', true, `Found ${cafesRes.data.length} cafes in database`)
            addTestResult('cafes', true, 'Cafe data is loading correctly')
          } else {
            addTestResult('database', false, 'No cafe data found - database might be empty')
            addTestResult('cafes', false, 'No cafes available')
          }
        } catch (error) {
          addTestResult('database', false, 'Database connection failed')
          addTestResult('cafes', false, 'Cafe endpoints not working')
        }

        // Test 3: Authentication
        try {
          const loginRes = await axios.post('/api/auth/login', {
            username: 'coffeelover',
            password: 'password123'
          })
          if (loginRes.data && loginRes.data.token) {
            addTestResult('authentication', true, 'Authentication is working - login successful')
          } else {
            addTestResult('authentication', false, 'Login returned unexpected response')
          }
        } catch (error) {
          if (error.response?.status === 404) {
            addTestResult('authentication', false, 'Authentication endpoints not found - backend needs restart')
          } else if (error.response?.status === 401) {
            addTestResult('authentication', false, 'Invalid credentials - check seed data')
          } else {
            addTestResult('authentication', false, `Authentication error: ${error.message}`)
          }
        }

        // Test 4: Reviews
        try {
          const reviewsRes = await axios.get('/api/reviews/public/recent?limit=5')
          addTestResult('reviews', true, 'Reviews endpoint is working')
        } catch (error) {
          if (error.response?.status === 404) {
            addTestResult('reviews', false, 'Reviews endpoints not found')
          } else {
            addTestResult('reviews', false, `Reviews error: ${error.message}`)
          }
        }

      } catch (error) {
        addTestResult('backend', false, 'Backend is not responding - check if it\'s running on port 8080')
      }
    }

    runTests()
  }, [])

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-500" />
    }
  }

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'success': return 'text-green-700 bg-green-50 border-green-200'
      case 'error': return 'text-red-700 bg-red-50 border-red-200'
      default: return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">CafeFinder System Status</h1>
      
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {Object.entries(status).map(([key, value]) => (
          <div key={key} className={`p-4 rounded-lg border ${getStatusColor(value)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold capitalize">{key}</h3>
                <p className="text-sm opacity-75">
                  {value === 'checking' ? 'Testing...' : 
                   value === 'success' ? 'Working' : 'Failed'}
                </p>
              </div>
              {getStatusIcon(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
        {testResults.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-gray-600">Running system tests...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.success ? 'success' : 'error')}`}>
                <div className="flex items-start space-x-3">
                  {getStatusIcon(result.success ? 'success' : 'error')}
                  <div className="flex-1">
                    <h4 className="font-medium capitalize">{result.test} Test</h4>
                    <p className="text-sm">{result.message}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {result.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-2 text-sm">
          <p><strong>If Backend is failing:</strong> Make sure it's running with <code className="bg-gray-200 px-1 rounded">./mvnw spring-boot:run</code></p>
          <p><strong>If Database is failing:</strong> Start MongoDB with <code className="bg-gray-200 px-1 rounded">docker compose up -d</code></p>
          <p><strong>If Authentication is failing:</strong> Backend might need restart to load new endpoints</p>
          <p><strong>Demo login:</strong> Username: <code className="bg-gray-200 px-1 rounded">coffeelover</code>, Password: <code className="bg-gray-200 px-1 rounded">password123</code></p>
        </div>
      </div>
    </div>
  )
}

export default Status
