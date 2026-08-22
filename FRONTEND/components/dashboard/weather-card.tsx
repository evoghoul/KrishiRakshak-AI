'use client'

import { useState, useEffect } from 'react'
import { Sun, Droplets, CloudRain, Wind, MapPin, Cloud } from 'lucide-react'

interface Metric {
  label: string
  value: string
  icon: typeof Sun
}

export function WeatherCard() {
  // 1. We create a state to hold our weather data, initially filled with your static design.
  const [weather, setWeather] = useState({
    temp: 34,
    condition: 'Mostly sunny',
    humidity: '62%',
    rainChance: '15%',
    wind: '11 km/h',
    location: 'Vadlamudi, Andhra Pradesh',
    hourly: [
      { time: 'Now', temp: '34°' },
      { time: '1 PM', temp: '35°' },
      { time: '2 PM', temp: '35°' },
      { time: '3 PM', temp: '34°' },
      { time: '4 PM', temp: '33°' },
      { time: '5 PM', temp: '31°' },
    ]
  })

  // 2. Fetch live data silently in the background when the component loads
  useEffect(() => {
    const getLiveWeather = async () => {
      try {
        // Using Vadlamudi coordinates (Lat: 16.23, Lon: 80.56)
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=16.2366&longitude=80.5630&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability&timezone=auto&forecast_days=2')
        const data = await response.json()

        const currentHour = new Date().getHours()
        
        // Map Open-Meteo weather codes to simple text
        const code = data.current.weather_code
        const condition = code <= 3 ? 'Mostly clear' : code < 60 ? 'Cloudy' : 'Rainy'

        // Get the next 6 hours dynamically based on the user's current clock
        const liveHourly = []
        for (let i = 0; i < 6; i++) {
          const hourIndex = currentHour + i
          const timeStr = i === 0 ? 'Now' : new Date(new Date().setHours(currentHour + i)).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
          liveHourly.push({
            time: timeStr,
            temp: Math.round(data.hourly.temperature_2m[hourIndex]) + '°'
          })
        }

        // Update our UI state with the real data
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          condition: condition,
          humidity: data.current.relative_humidity_2m + '%',
          rainChance: data.hourly.precipitation_probability[currentHour] + '%',
          wind: Math.round(data.current.wind_speed_10m) + ' km/h',
          location: 'Vadlamudi, Andhra Pradesh',
          hourly: liveHourly
        })
      } catch (error) {
        console.error('Error fetching live weather:', error)
      }
    }

    getLiveWeather()
  }, [])

  // 3. Connect our live state to the visual metrics
  const METRICS: Metric[] = [
    { label: 'Humidity', value: weather.humidity, icon: Droplets },
    { label: 'Rain chance', value: weather.rainChance, icon: CloudRain },
    { label: 'Wind', value: weather.wind, icon: Wind },
  ]

  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-secondary">
            {/* Dynamically change the main icon based on the weather */}
            {weather.condition === 'Rainy' ? (
               <CloudRain className="size-11 text-primary" aria-hidden="true" />
            ) : weather.condition === 'Cloudy' ? (
               <Cloud className="size-11 text-primary" aria-hidden="true" />
            ) : (
               <Sun className="size-11 text-primary" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              {weather.location}
            </p>
            <p className="mt-1 flex items-start text-6xl font-bold leading-none text-foreground">
              {weather.temp}<span className="mt-1 text-2xl">°C</span>
            </p>
            <p className="mt-1 text-sm font-medium text-primary">{weather.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {METRICS.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.label}
                className="flex min-w-24 flex-col items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3 text-center"
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <span className="text-lg font-bold text-foreground">{m.value}</span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-border sm:grid-cols-6">
        {weather.hourly.map((h, i) => (
          <div
            key={h.time + i}
            className={`flex flex-col items-center gap-1 py-3 ${
              i !== 0 ? 'border-l border-border' : ''
            } ${i >= 3 ? 'border-t sm:border-t-0' : ''}`}
          >
            <span className="text-xs text-muted-foreground">{h.time}</span>
            {/* Dynamically change the mini icons based on the weather */}
            {weather.condition === 'Rainy' ? (
               <CloudRain className="size-4 text-primary" aria-hidden="true" />
            ) : (
               <Sun className="size-4 text-primary" aria-hidden="true" />
            )}
            <span className="text-sm font-semibold text-foreground">{h.temp}</span>
          </div>
        ))}
      </div>
    </section>
  )
}