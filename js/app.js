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
  const forecastCards = createForecastCards(weatherData.daily);

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

const getWeatherDescription = (code) => {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm"
  };

  return descriptions[code] ?? "Unknown weather condition";
}

const createForecastCards = (dailyData) => {
  return dailyData.time.map((date, index) => {
    const maxTemperature =
      dailyData.temperature_2m_max[index];

    const minTemperature =
      dailyData.temperature_2m_min[index];

    const weatherCode =
      dailyData.weather_code[index];

    const description =
      getWeatherDescription(weatherCode);

    return `
            <article class="forecast-card">
                <h3>${date}</h3>

                <p class="forecast-description">
                    ${description}
                </p>

                <p>
                    High: ${maxTemperature}°C
                </p>

                <p>
                    Low: ${minTemperature}°C
                </p>
            </article>
        `;
  });
}