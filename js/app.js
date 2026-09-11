const locationForm = document.getElementById("location-form");
const locationInput = document.getElementById("location");
const searchButton = locationForm.querySelector("button");
const statusMessage = document.getElementById("status");
const weatherDisplay = document.getElementById("weather-display");

let temperatureChart = null;

const getLocation = () => {
  return locationInput.value.trim();
};

const showLoading = () => {
  statusMessage.textContent = "Loading weather information...";
  weatherDisplay.innerHTML = "";
  searchButton.disabled = true;
}

const showError = (message) => {
  statusMessage.textContent = message;
  searchButton.disabled = false;
  weatherDisplay.innerHTML = "";
}

const showWeather = (locationData, weatherData) => {
  statusMessage.textContent = "";
  searchButton.disabled = false;
  const temperature = weatherData.current.temperature_2m;
  const feelsLike = weatherData.current.apparent_temperature;
  const humidity = weatherData.current.relative_humidity_2m;
  const weatherCode = weatherData.current.weather_code;
  const weatherInfo = getWeatherInfo(weatherCode);
  const forecastData = prepareForecastData(weatherData.daily);
  const processedForecast = processForecastDays(forecastData);
  const dailyWeatherDetails = createDailyWeatherDetails(processedForecast);
  const forecastSummary = createForecastSummary(forecastData);

  weatherDisplay.innerHTML = `
    <div class="weather-card">
      <h2>
        ${locationData.name}
      </h2>
      <div class="weather-icon">
        ${weatherInfo.icon}
      </div>
      <div class="temperature">
        ${temperature}°C
      </div>
      <p class="weather-description">
        ${weatherInfo.description}
      </p>
      <p>
        Feels like: ${feelsLike}°C
      </p>
      <p>
        Humidity: ${humidity}%
      </p>
    </div>
    ${forecastSummary}
    <section class="weather-chart">
      <h2>Temperature Forecast</h2>
      <div class="chart-container">
        <canvas id="temperature-chart"></canvas>
      </div>
    </section>
    ${dailyWeatherDetails}
  `;
  createTemperatureChart(forecastData);
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
    showError(error.message);
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
    `&current=temperature_2m,relative_humidity_2m,weather_code,apparent_temperature` +
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

const processForecastDays = (forecastData, index = 0, result = []) => {
  if (index >= forecastData.length) {
    return result;
  }

  const currentDay = forecastData[index];

  result.push({
    date: formatForecastDate(currentDay.date),
    weather: getWeatherInfo(currentDay.weatherCode),
    maxTemperature: currentDay.maxTemperature,
    minTemperature: currentDay.minTemperature
  });

  return processForecastDays(
    forecastData,
    index + 1,
    result
  );
}

const createDailyWeatherDetails = (processedForecast) => {

  const details = processedForecast.map(day => {
    return `
      <article class="daily-detail">
        <h3>${day.date}</h3>
        <p>
          ${day.weather.icon}
          ${day.weather.description}
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

  return `
    <section class="daily-details">
      <h2>Daily Weather Details</h2>
      <div class="daily-details-grid">
        ${details.join("")}
      </div>
    </section>
  `;
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
  const averageHigh =
    getAverageHighTemperature(forecastData);

  return `
    <section class="forecast-summary">
      <h2>Forecast Summary</h2>
      <p class="summary-item">
        <span class="summary-icon" aria-hidden="true">🌡️</span>
        <span class="summary-label">Average high</span>
        <strong>${averageHigh.toFixed(1)}°C</strong>
      </p>
      <p class="summary-item">
        <span class="summary-icon" aria-hidden="true">☀️</span>
        <span class="summary-label">Warm days</span>
        <strong>${warmDays.length}</strong>
      </p>
    </section>
    `;
}

const createTemperatureChart = (forecastData) => {
  const chartCanvas = document.getElementById("temperature-chart");
  const labels = forecastData.map(day => {
    return formatForecastDate(day.date);
  });
  const maximumTemperatures = forecastData.map(day => {
    return day.maxTemperature;
  });
  const minimumTemperatures = forecastData.map(day => {
    return day.minTemperature;
  });

  if (temperatureChart !== null) {
    temperatureChart.destroy();
  }

  temperatureChart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Maximum Temperature",
          data: maximumTemperatures,
          borderColor: "#ef4444",
          backgroundColor: "#ef4444",
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#ef4444",
          pointBorderWidth: 3,
          tension: 0.3
        },
        {
          label: "Minimum Temperature",
          data: minimumTemperatures,
          borderColor: "#2563eb",
          backgroundColor: "#2563eb",
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#2563eb",
          pointBorderWidth: 3,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y}°C`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)"
          },
          beginAtZero: false
        }
      }
    }
  });
}