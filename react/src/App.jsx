import { useState } from 'react'
import './App.css'
import WeatherIcon from "./component/WeatherIcon.jsx";

const SUGGESTIONS = ['London', 'Tokyo', 'Hyderabad', 'New York', 'Sydney']

function iconUrl(icon) {
  return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${icon}.png`
}

async function loadWeather(place) {
  let response
  try {
    response = await fetch(`/api/${encodeURIComponent(place.trim())}`)
  } catch {
    throw new Error('Cannot reach the weather API. Start Redis and the Spring backend.')
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('Cannot reach the weather API. Start Redis and the Spring backend.')
    }
    throw new Error('No forecast for that place. Try a city name.')
  }

  return response.json()
}

export default function App() {
  const [query, setQuery] = useState('London')
  const [active, setActive] = useState('')
  const [weather, setWeather] = useState({
    city: 'London, England, United Kingdom',
    temp: 58,
    humidity: 72,
    datetime: '2026-10-06',
    icon: 'partly-cloudy-day',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function lookup(place) {
    const next = (place ?? query).trim()
    if (!next) {
      setError('Enter a city or country.')
      return
    }

    setLoading(true)
    setError('')
    setActive(next)
    setQuery(next)

    try {
      const data = await loadWeather(next)
      setWeather(data)
    } catch (err) {
      setWeather(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(event) {
    event.preventDefault()
    lookup(query)
  }

  return (
    <main className="page">
      <header className="masthead">
        <div>
          <p className="kicker">Skyline</p>
          <h1>Today’s weather</h1>
        </div>
        <p className="lede">Look up a city. The Spring API caches results in Redis.</p>
      </header>

      <form className="search" onSubmit={onSubmit}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="City or country"
          aria-label="City or country"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Looking…' : 'Get weather'}
        </button>
      </form>

      <div className="chips">
        {SUGGESTIONS.map((city) => (
          <button
            key={city}
            type="button"
            className={active === city ? 'active' : ''}
            onClick={() => lookup(city)}
          >
            {city}
          </button>
        ))}
      </div>

      <section className="panel" aria-live="polite">
        {loading && <p className="status">Fetching the forecast…</p>}
        {!loading && error && <p className="error">{error}</p>}
        {!loading && !error && !weather && (
          <p className="hint">Search a place to see temperature, humidity, and conditions.</p>
        )}
        {!loading && weather && (
          <div className="weather">
            <div>
              <p className="place">{weather.city}</p>
              <p className="temp">{Math.round(((weather.temp)-32)/1.8)}°C</p>
              <div className="meta">
                <span>{weather.datetime}</span>
                <span>{Math.round(weather.humidity)}% humidity</span>
              </div>
            </div>
            {weather.icon && (
                <WeatherIcon icon={weather?.icon} size={64} />
            )}
          </div>
        )}
      </section>

      <p className="footer">Temperatures come from Visual Crossing in the units the API returns (usually °F).</p>
    </main>
  )
}
