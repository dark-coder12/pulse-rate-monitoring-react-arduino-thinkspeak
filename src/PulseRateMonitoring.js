import React, { useState, useEffect } from 'react'
import BuzzerControl from './BuzzerControl'
import axios from 'axios'

function PulseRateMonitoring() {
  const [pulseData, setPulseData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()

        setPulseData(data.feeds || [])
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching pulse data:', error)
        setError(error.message)
        setIsLoading(false)
      }
    }

    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds

    // Cleanup function
    return () => clearInterval(interval)
  }, [])

  const lowBloodPressureGuidelines = (
    <div className="p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold text-white mb-2">Low Blood Pressure Guidelines</h2>
      <ul className="list-disc ml-6">
        <li>Stay hydrated.</li>
        <li>Avoid sudden changes in position.</li>
        <li>Eat small, low-carb meals.</li>
        <li>Monitor your symptoms closely.</li>
      </ul>
    </div>
  )

  const handleEmergencyCall = () => {
    window.location.href = 'https://api.whatsapp.com/send?phone=923314360727&text=HELP'
    console.log('Emergency call initiated')
  }

  function sendCommand() {
    axios
      .post('http://localhost:5000/buzzer', { command: 'on' }) // Change to match your Express server URL
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error sending command:', error)
      })
  }

  return (
    <div className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Pulse Rate Monitoring</h1>
        {isLoading ? (
          <p className="text-lg text-center">Loading...</p>
        ) : error ? (
          <div className="text-lg text-red-500 text-center">{error}</div>
        ) : (
          <div>
            {lowBloodPressureGuidelines}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.isArray(pulseData) &&
                pulseData.map((reading) => (
                  <PulseCard key={reading.entry_id} reading={reading} sendCommand={sendCommand} />
                ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={handleEmergencyCall}
                className="bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600 transition-colors duration-300 ease-in-out"
              >
                Emergency Call
              </button>
            </div>
            <BuzzerControl />
          </div>
        )}
      </div>
    </div>
  )
}

function PulseCard({ reading, sendCommand }) {
  const pulseValue = reading.field1
  const isHighPulse = pulseValue > 85

  useEffect(() => {
    if (isHighPulse) {
      sendCommand()
    }
  }, [isHighPulse])

  return (
    <div
      className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out ${
        isHighPulse ? 'border border-red-500' : ''
      }`}
    >
      <div className="px-6 py-8">
        {isHighPulse ? (
          <>
            <p className="text-xl font-semibold text-red-500 mb-4">High Pulse Rate Alert!</p>
            <p className="text-lg">Pulse Rate: {pulseValue}</p>
          </>
        ) : (
          <p className="text-lg">Pulse Rate: {pulseValue}</p>
        )}
         <p className="text-lg">Created At: {new Date(reading.created_at).toLocaleString()}</p>
      </div>
    </div>
  )
}

export default PulseRateMonitoring