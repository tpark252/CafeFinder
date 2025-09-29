import React, { useState } from 'react'
import axios from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'

const BusyHoursChart = ({ cafeId, busyHours = [] }) => {
  const { user } = useAuth()
  const [reportingBusy, setReportingBusy] = useState(false)
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState(50)
  const [waitTime, setWaitTime] = useState('')

  // Process busy hours data for visualization
  const processHourlyData = () => {
    const hourlyAverage = {}
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyAverage[i] = { total: 0, count: 0, average: 0 }
    }

    // Process busy hours data
    busyHours.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours()
      hourlyAverage[hour].total += entry.crowdLevel
      hourlyAverage[hour].count += 1
    })

    // Calculate averages
    Object.keys(hourlyAverage).forEach(hour => {
      const data = hourlyAverage[hour]
      data.average = data.count > 0 ? data.total / data.count : 0
    })

    return hourlyAverage
  }

  const processWeeklyData = () => {
    const weeklyData = {}
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    // Initialize all days
    dayNames.forEach((day, index) => {
      weeklyData[index] = { name: day, total: 0, count: 0, average: 0 }
    })

    // Process data
    busyHours.forEach(entry => {
      const day = new Date(entry.timestamp).getDay()
      weeklyData[day].total += entry.crowdLevel
      weeklyData[day].count += 1
    })

    // Calculate averages
    Object.keys(weeklyData).forEach(day => {
      const data = weeklyData[day]
      data.average = data.count > 0 ? data.total / data.count : 0
    })

    return Object.values(weeklyData)
  }

  const reportBusyStatus = async () => {
    if (!user) {
      toast.error('Please log in to report busy status')
      return
    }

    setReportingBusy(true)
    try {
      await axios.post(`/api/busy/cafe/${cafeId}/quick-report`, null, {
        params: {
          crowdLevel: selectedCrowdLevel,
          waitMins: waitTime ? parseInt(waitTime) : null
        }
      })
      
      toast.success('Thank you for the update!')
      // Reset form
      setSelectedCrowdLevel(50)
      setWaitTime('')
    } catch (error) {
      console.error('Error reporting busy status:', error)
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setReportingBusy(false)
    }
  }

  const getCrowdLevelColor = (level) => {
    if (level <= 30) return 'bg-green-500'
    if (level <= 60) return 'bg-yellow-500'
    if (level <= 85) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getCrowdLevelText = (level) => {
    if (level <= 30) return 'Quiet'
    if (level <= 60) return 'Moderate'
    if (level <= 85) return 'Busy'
    return 'Very Busy'
  }

  const hourlyData = processHourlyData()
  const weeklyData = processWeeklyData()

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Busy Hours & Real-Time Status</h3>

      {/* Report Current Status */}
      <div className="card">
        <h4 className="text-lg font-medium mb-4">Report Current Status</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How busy is it right now?
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedCrowdLevel}
                onChange={(e) => setSelectedCrowdLevel(parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="text-right min-w-[100px]">
                <div className={`inline-block px-3 py-1 rounded-full text-white text-sm ${getCrowdLevelColor(selectedCrowdLevel)}`}>
                  {getCrowdLevelText(selectedCrowdLevel)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{selectedCrowdLevel}%</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current wait time (optional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={waitTime}
                onChange={(e) => setWaitTime(e.target.value)}
                placeholder="0"
                min="0"
                max="120"
                className="input-field w-24"
              />
              <span className="text-sm text-gray-600">minutes</span>
            </div>
          </div>

          <button
            onClick={reportBusyStatus}
            disabled={reportingBusy || !user}
            className="btn-primary"
          >
            {reportingBusy ? 'Submitting...' : 'Submit Report'}
          </button>
          
          {!user && (
            <p className="text-sm text-gray-500">Please log in to report busy status</p>
          )}
        </div>
      </div>

      {/* Hourly Trends */}
      <div className="card">
        <h4 className="text-lg font-medium mb-4">Average Busy Hours</h4>
        {busyHours.length > 0 ? (
          <div className="space-y-2">
            {Object.entries(hourlyData).map(([hour, data]) => {
              const hourInt = parseInt(hour)
              const display12Hour = hourInt === 0 ? '12 AM' : 
                                   hourInt < 12 ? `${hourInt} AM` :
                                   hourInt === 12 ? '12 PM' :
                                   `${hourInt - 12} PM`
              
              return (
                <div key={hour} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium w-16">{display12Hour}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div
                        className={`h-4 rounded-full ${getCrowdLevelColor(data.average)}`}
                        style={{ width: `${Math.max(data.average, 5)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-20">
                    {data.count > 0 ? `${Math.round(data.average)}%` : 'No data'}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No busy hours data available yet. Be the first to report!
          </p>
        )}
      </div>

      {/* Weekly Trends */}
      <div className="card">
        <h4 className="text-lg font-medium mb-4">Weekly Trends</h4>
        {busyHours.length > 0 ? (
          <div className="space-y-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium w-20">{day.name}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 relative">
                    <div
                      className={`h-4 rounded-full ${getCrowdLevelColor(day.average)}`}
                      style={{ width: `${Math.max(day.average, 5)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-20">
                  {day.count > 0 ? `${Math.round(day.average)}%` : 'No data'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No weekly data available yet.
          </p>
        )}
      </div>

      {/* Recent Reports */}
      {busyHours.length > 0 && (
        <div className="card">
          <h4 className="text-lg font-medium mb-4">Recent Reports</h4>
          <div className="space-y-3">
            {busyHours.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${
                    entry.crowdLevel <= 30 ? 'badge-green' :
                    entry.crowdLevel <= 60 ? 'badge-yellow' :
                    entry.crowdLevel <= 85 ? 'badge-red' : 'badge-red'
                  }`}>
                    {getCrowdLevelText(entry.crowdLevel)}
                  </span>
                  {entry.waitMins && (
                    <span className="text-sm text-gray-600">
                      {entry.waitMins}min wait
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BusyHoursChart
