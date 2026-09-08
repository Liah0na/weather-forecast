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

  weatherDisplay.innerHTML = `
    <div class="weather-card">
      <h2>${locationData.name}</h2>
      <div class="temperature">
        ${temperature}°C
      </div>
      <p>
        Humidity: ${humidity}
      </p>
    </div>
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