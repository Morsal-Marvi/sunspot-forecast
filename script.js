//login
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if the user exists and password matches
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    alert("Login successful!");
    // Redirect to dashboard or another page
    window.location.href = "index-1.html"; // Change this to your desired page
  } else {
    alert("Invalid email or password. Please try again.");
  }
}
// notif
// Function to send alerts
function sendAlert(message) {
  alert(message);
}

// Function to check for severe weather conditions
async function checkWeather() {
  let API_KEY = "44198db58972430a86d195656241210"; // Your new WeatherAPI key
  const location = "Herat"; // Specify location (e.g., city name or coordinates)
  const lat = 34.3494; // Latitude for Herat
  const lon = 62.2015; // Longitude for Herat
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`
    );
    const data = await response.json();

    // Check for severe weather conditions in the forecast
    let hasSevereWeather = false;
    data.forecast.forecastday.forEach((day) => {
      if (day.day.daily_will_it_rain > 0.5 || day.day.totalprecip_mm > 50) {
        // Example condition for heavy rain
        hasSevereWeather = true;
      }
    });

    if (hasSevereWeather) {
      sendAlert(
        "Severe weather condition detected in your area for the next 7 days."
      );
    } else {
      sendAlert(
        "No severe weather condition in your area for the next 7 days."
      );
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    sendAlert("Unable to fetch weather data. Please try again later.");
  }
}

// Function to start the timer for alerts
function startAlertTimer() {
  const alertTime = 5000; // milliseconds
  setTimeout(checkWeather, alertTime);
}

// Start the alert timer when the page loads
window.onload = startAlertTimer;

//after login
let API_KEY = "44198db58972430a86d195656241210"; // Your new WeatherAPI key

const weatherIcons = {
  Clear: "fas fa-sun",
  "Partly cloudy": "fas fa-cloud-sun",
  Cloudy: "fas fa-cloud",
  Overcast: "fas fa-cloud-meatball",
  Drizzle: "fas fa-cloud-rain",
  Rain: "fas fa-cloud-showers-heavy",
  Thunderstorm: "fas fa-bolt",
  Snow: "fas fa-snowflake",
  Fog: "fas fa-smog",
  Mist: "fas fa-smog",
  Dust: "fas fa-dust",
  Sand: "fas fa-sandstorm",
};

// Function to fetch weather by city name
async function getWeatherByCity(city) {
  try {
    // Fetch current weather data by city
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();

    // Call function to get 7-day forecast using latitude and longitude from the city weather data
    get7DayForecast(data.location.lat, data.location.lon);

    displayCurrentWeather(data); // Update current weather section
    displayHighlights(data); // Update today's highlights section
    updateLocationDisplay(data.location.name, data.location.country); // Update location display
    document
      .getElementById("weather-section")
      .scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    document.getElementById("weather").innerHTML =
      "Failed to fetch weather data.";
    console.error("Error fetching weather data:", error);
  }
}

// Function to get 7-day forecast
async function get7DayForecast(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`
    );
    const forecastData = await response.json();
    display7DayForecast(forecastData.forecast.forecastday); // Update the 7-day forecast
  } catch (error) {
    console.error("Error fetching 7-day forecast:", error);
  }
}

function displayCurrentWeather(data) {
  const currentWeatherSection = document.getElementById("degree");
  currentWeatherSection.innerHTML = `${data.current.temp_c}°C`;

  const weatherDesc = document.querySelector(".my-weather p strong");
  weatherDesc.innerHTML = data.current.condition.text;

  // Update icon based on weather condition or use a default icon
  const weatherIconContainer = document.querySelector(".weather-icon");
  const iconClass =
    weatherIcons[data.current.condition.text] || "fas fa-snowflake"; // Default icon
  weatherIconContainer.innerHTML = `<i class="${iconClass}" style="font-size: 48px"></i>`;

  const dateElem = document.querySelector(
    ".my-weather .fa-calendar-alt"
  ).parentElement;
  const options = { weekday: "long", day: "numeric", month: "long" };
  const currentDate = new Date().toLocaleDateString(undefined, options);
  dateElem.innerHTML = `<i class="fas fa-calendar-alt" style="font-size: 20px; padding-right: 10px"></i>${currentDate}<br>
  <i class="fas fa-map-marker-alt" style="font-size: 20px; color: white; padding-right: 10px"></i>${data.location.name}, ${data.location.country}`;
}

function display7DayForecast(daily) {
  const forecastSection = document.querySelectorAll(".flex-item.my-weather")[1];
  forecastSection.innerHTML = "<h5>7-Day Forecast</h5>";

  daily.forEach((day) => {
    const dayTemp = day.day.avgtemp_c; // Average temperature for the day
    const dayDate = new Date(day.date);
    const options = { weekday: "long", day: "numeric", month: "short" };
    const dayString = dayDate.toLocaleDateString(undefined, options);

    // Use a default icon for the 7-day forecast
    const iconClass = "fas fa-snowflake"; // Change this to any default icon you want

    forecastSection.innerHTML += `
      <p>
        <i class="${iconClass}" style="font-size: 20px; padding-right: 10px"></i>
        ${dayTemp}°C ${dayString}
      </p>
    `;
  });
}

// Function to display highlights
function displayHighlights(data) {
  const humidityElem = document.querySelector(
    ".high-css:nth-child(1) .percent strong"
  );
  humidityElem.innerText = `${data.current.humidity}%`;

  const tempElem = document.querySelector(
    ".high-css:nth-child(2) .percent strong"
  );
  tempElem.innerText = `${data.current.temp_c}°C`;

  const windElem = document.querySelector(
    ".high-css:nth-child(3) .percent strong"
  );
  windElem.innerText = `${data.current.wind_kph} km/h`;
}

// Function to update location display
function updateLocationDisplay(cityName, countryCode) {
  const locationElement = document.getElementById("current-location");
  locationElement.innerText = `${cityName}, ${countryCode}`;
}

// Function to handle location
function handleLocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherByLatLon(lat, lon);
}

// Function to get weather by latitude and longitude
async function getWeatherByLatLon(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
    );
    const data = await response.json();

    get7DayForecast(lat, lon);
    displayCurrentWeather(data);
    displayHighlights(data);
    updateLocationDisplay(data.location.name, data.location.country);
  } catch (error) {
    document.getElementById("weather").innerHTML =
      "Failed to fetch weather data.";
    console.error("Error fetching weather data:", error);
  }
}

// Function to handle location error
function handleLocationError(error) {
  document.getElementById(
    "current-location"
  ).innerText = `Error: ${error.message}`;
}

// Function to request location
function requestLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      handleLocation,
      handleLocationError
    );
  } else {
    document.getElementById("current-location").innerText =
      "Geolocation is not supported by this browser.";
  }
}

// Event listener for search input
document.querySelector(".search-bar").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const city = e.target.value;
    getWeatherByCity(city);
  }
});

// Initial request for location
requestLocation();

// Function to fetch historical weather data
async function getHistoricalWeather(city, date) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${city}&dt=${date}`
    );
    if (!response.ok) {
      throw new Error("Historical data not found for the selected date.");
    }
    const data = await response.json();
    displayHistoricalWeather(data); // Call function to display data
  } catch (error) {
    document.getElementById("weather-data").innerHTML =
      "Failed to fetch historical weather data.";
    console.error("Error fetching historical weather:", error);
  }
}

// Function to display historical weather data
function displayHistoricalWeather(data) {
  const weatherDataElem = document.getElementById("weather-data");

  const location = `${data.location.name}, ${data.location.country}`;
  const temperature = `${data.forecast.forecastday[0].day.avgtemp_c}°C`;
  const humidity = `${data.forecast.forecastday[0].day.avghumidity}%`;
  const windSpeed = `${data.forecast.forecastday[0].day.maxwind_kph} Km/h`;

  weatherDataElem.innerHTML = `
    <hr />
    <h4 style="font-family: Dancing Script, cursive;">Here is the Historical Data:</h4>
    <div class="weather-entry">
      <p><i class="fa-solid fa-location-dot"></i><strong>Location:</strong> ${location}</p>
      <div class="weather-detail">
        <p><i class="fa-solid fa-cloud"></i> <strong>Humidity:</strong> ${humidity}</p>
      </div>
      <div class="weather-detail">
        <p><i class="fa-solid fa-wind"></i> <strong>Wind Speed:</strong> ${windSpeed}</p>
      </div>
      <div class="weather-detail">
        <p><i class="fa-solid fa-temperature-half"></i> <strong>Temperature:</strong> ${temperature}</p>
      </div>
    </div>
  `;
}

// Event listener for historical weather search
document.getElementById("date").addEventListener("change", function () {
  const city = document.getElementById("data").value; // Input field for city
  const date = this.value; // Date selected by the user
  if (city && date) {
    getHistoricalWeather(city, date);
  }
});

// Initialize the map
var map = L.map("map").setView([34.52, 69.18], 6); // Set initial view to Kabul

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

// Example marker with weather data
var marker = L.marker([34.52, 69.18])
  .addTo(map)
  .bindPopup("<b>Kabul</b><br>Temperature: 34°C<br>Humidity: 32%")
  .openPopup();

// Add more markers as needed for different locations
var marker2 = L.marker([35.68, 51.38])
  .addTo(map)
  .bindPopup("<b>Tehran</b><br>Temperature: 30°C<br>Humidity: 50%");

var marker3 = L.marker([29.98, 31.13])
  .addTo(map)
  .bindPopup("<b>Cairo</b><br>Temperature: 35°C<br>Humidity: 40%");
// dashboard
// Elements
const locationInput = document.getElementById("location-input");
const addLocationBtn = document.getElementById("add-location-btn");
const locationList = document.getElementById("location-list");
const weatherContent = document.getElementById("weather-content");
const alertsContent = document.getElementById("alerts-content");

// Array to store preferred locations and their data
let preferredLocations = [];

// Add location function
addLocationBtn.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (location && !preferredLocations.some((loc) => loc.name === location)) {
    fetchWeatherAndAlerts(location)
      .then((data) => {
        preferredLocations.push({ name: location, data });
        updatePreferredLocations();
        displayWeatherData(data); // Show weather for the new location immediately
        displayWeatherAlerts(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
    locationInput.value = ""; // Clear the input
  }
});

// Update preferred locations list
function updatePreferredLocations() {
  locationList.innerHTML = "";
  preferredLocations.forEach((loc, index) => {
    const listItem = document.createElement("li");
    listItem.innerText = loc.name;
    listItem.addEventListener("click", () => {
      displayWeatherData(loc.data); // Show weather data for the clicked location
      displayWeatherAlerts(loc.data); // Show alerts for the clicked location
    });
    locationList.appendChild(listItem);
  });
}

// Fetch weather and alerts data for location
async function fetchWeatherAndAlerts(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=1&alerts=yes`
    );
    const data = await response.json();
    return data; // Return data so we can process it after fetching
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

// Display weather data
function displayWeatherData(data) {
  weatherContent.innerHTML = `
<div class="weather-detail">
   <strong>Location:</strong> ${data.location.name}, ${data.location.country}
</div>
<div class="weather-detail">
   <strong>Temperature:</strong> ${data.current.temp_c}°C
</div>
<div class="weather-detail">
   <strong>Condition:</strong> ${data.current.condition.text}
</div>
<div class="weather-detail">
   <strong>Humidity:</strong> ${data.current.humidity}%
</div>
<div class="weather-detail">
   <strong>Wind Speed:</strong> ${data.current.wind_kph} km/h
</div>
`;
}

// Display weather alerts
function displayWeatherAlerts(data) {
  const alerts = data.alerts?.alert || []; // Access alerts in the forecast data, default to empty array if no alerts
  alertsContent.innerHTML = ""; // Clear any existing content

  if (alerts.length > 0) {
    alertsContent.innerHTML = `<h3>Weather Alerts</h3>`;
    alerts.forEach((alert) => {
      alertsContent.innerHTML += `
   <div class="alert-detail">
     <p><strong>Alert:</strong> ${alert.headline}</p>
     <p><strong>Description:</strong> ${alert.desc}</p>
   </div>
   <hr />
 `;
    });
  } else {
    alertsContent.innerHTML = "<p>No weather alerts at the moment.</p>";
  }
}
