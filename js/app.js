const locationForm = document.getElementById("location-form");
const locationInput = document.getElementById("location");
const statusMessage = document.getElementById("status");
const weatherDisplay = document.getElementById("weather-display");


function getLocation() {
  return locationInput.value.trim();
}


function showLoading() {
  statusMessage.textContent = "Loading weather information...";
  weatherDisplay.innerHTML = "";
}


function showWeather(location) {
  weatherDisplay.innerHTML = `
    <div class="weather-card">
      <h2>${location}</h2>
      <div class="temperature">--°</div>
      <p class="weather-description">
        Weather information will appear here.
      </p>
    </div>
    `;
}


function handleSearch(event) {
  event.preventDefault();

  const location = getLocation();

  if (location === "") {
    statusMessage.textContent = "Please enter a location.";
    weatherDisplay.innerHTML = "";
        
    return;
  }

  showLoading();

  setTimeout(() => {
    statusMessage.textContent = "";
    showWeather(location);
  }, 1000);
}


locationForm.addEventListener("submit", handleSearch);