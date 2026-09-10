const locationForm = document.getElementById("location-form");
const locationInput = document.getElementById("location");
const statusMessage = document.getElementById("status");
const weatherDisplay = document.getElementById("weather-display");

const getLocation = () => {
  return locationInput.value.trim();
};

const showLoading = () => {
  statusMessage.textContent = "Loading weather information...";
  weatherDisplay.innerHTML = "";
}

const showWeather = (locationData, weatherData) => {
  const temperature = weatherData.current.temperature_2m;
  const humidity = weatherData.current.relative_humidity_2m;
  const forecastData = prepareForecastData(weatherData.daily);
  const forecastCards = createForecastCards(forecastData);
  const forecastSummary = createForecastSummary(forecastData);

  weatherDisplay.innerHTML = `
    <div class="weather-card">
      <h2>
        ${locationData.name}
      </h2>
      <div class="temperature">
        ${temperature}°C
      </div>
      <p>
        Humidity: ${humidity}%
      </p>
    </div>
    ${forecastSummary}
    <section class="forecast">
      <h2>Forecast</h2>
      <div class="forecast-grid">
        ${forecastCards.join("")}
      </div>
    </section>
  `;
}

const handleSearch = async (event) => {
  event.preventDefault();

  const location = getLocation();

  if (location === "") {
    statusMessage.textContent = "Please enter a location.";
    weatherDisplay.innerHTML = "";
    return;
  }

  try {
    showLoading();

    const locationData = await getCoordinates(location);

    const weatherData = await getWeather(
      locationData.latitude,
      locationData.longitude
    );

    statusMessage.textContent = "";

    showWeather(
      locationData,
      weatherData
    );

  } catch (error) {
    statusMessage.textContent = error.message;
    weatherDisplay.innerHTML = "";
  }
}

locationForm.addEventListener("submit", handleSearch);

const getCoordinates = async (location) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve location information.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`Location "${location}" was not found.`);
  }

  return data.results[0];
}

const getWeather = async (latitude, longitude) => {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve weather information.");
  }

  return await response.json();
}

const getWeatherInfo = (code) => {
  const weatherConditions = {
    0: {
      icon: "☀️",
      description: "Clear sky"
    },
    1: {
      icon: "🌤️",
      description: "Mainly clear"
    },
    2: {
      icon: "⛅",
      description: "Partly cloudy"
    },
    3: {
      icon: "☁️",
      description: "Overcast"
    },
    45: {
      icon: "🌫️",
      description: "Fog"
    },
    48: {
      icon: "🌫️",
      description: "Depositing rime fog"
    },
    51: {
      icon: "🌦️",
      description: "Light drizzle"
    },
    53: {
      icon: "🌦️",
      description: "Moderate drizzle"
    },
    55: {
      icon: "🌧️",
      description: "Dense drizzle"
    },
    61: {
      icon: "🌧️",
      description: "Slight rain"
    },
    63: {
      icon: "🌧️",
      description: "Moderate rain"
    },
    65: {
      icon: "🌧️",
      description: "Heavy rain"
    },
    71: {
      icon: "🌨️",
      description: "Slight snow"
    },
    73: {
      icon: "🌨️",
      description: "Moderate snow"
    },
    75: {
      icon: "❄️",
      description: "Heavy snow"
    },
    80: {
      icon: "🌦️",
      description: "Slight rain showers"
    },
    81: {
      icon: "🌧️",
      description: "Moderate rain showers"
    },
    82: {
      icon: "⛈️",
      description: "Violent rain showers"
    },
    95: {
      icon: "⛈️",
      description: "Thunderstorm"
    }
  };

  return weatherConditions[code] ?? {
    icon: "❓",
    description: "Unknown weather condition"
  };
}

const formatForecastDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

const createForecastCards = (forecastData) => {
  return forecastData.map(day => {
    const weatherInfo = getWeatherInfo(day.weatherCode);
    const formattedDate = formatForecastDate(day.date);

    return `
      <article class="forecast-card">
        <h3>${formattedDate}</h3>
        <div class="weather-icon">
          ${weatherInfo.icon}
        </div>
        <p class="forecast-description">
          ${weatherInfo.description}
        </p>
        <p>
          High: ${day.maxTemperature}°C
        </p>
        <p>
          Low: ${day.minTemperature}°C
        </p>
      </article>
    `;
  });
}

const prepareForecastData = (dailyData) => {
  return dailyData.time.map((date, index) => {
    return {
      date: date,
      maxTemperature: dailyData.temperature_2m_max[index],
      minTemperature: dailyData.temperature_2m_min[index],
      weatherCode: dailyData.weather_code[index]
    };
  });
}

const getWarmDays = (forecastData) => {
  return forecastData.filter(day => {
    return day.maxTemperature >= 25;
  });
}

const getAverageHighTemperature = (forecastData) => {
  const totalTemperature = forecastData.reduce(
    (total, day) => {
      return total + day.maxTemperature;
    },
    0
  );

  return totalTemperature / forecastData.length;
}

const createForecastSummary = (forecastData) => {
  const warmDays = getWarmDays(forecastData);
  const averageHigh = getAverageHighTemperature(forecastData);

  return `
    <section class="forecast-summary">
      <h2>Forecast Summary</h2>
      <p>
        Average high:
        <strong>${averageHigh.toFixed(1)}°C</strong>
      </p>
      <p>
        Warm days:
        <strong>${warmDays.length}</strong>
      </p>
    </section>
    `;
}