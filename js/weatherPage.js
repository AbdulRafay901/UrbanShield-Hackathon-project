import { WEATHER_API_KEY } from "../config.js";


// DOM Elements
const locationNameEl = document.getElementById("weatherLocationName");
const dateStrEl = document.getElementById("weatherDateStr");

const mainTempEl = document.getElementById("weatherMainTemp");
const condTitleEl = document.getElementById("weatherCondTitle");
const feelsLikeEl = document.getElementById("weatherFeelsLike");
const mainImgEl = document.getElementById("weatherMainImg");

const humidityEl = document.getElementById("weatherHumidity");
const windEl = document.getElementById("weatherWind");
const pressureEl = document.getElementById("weatherPressure");
const visibilityEl = document.getElementById("weatherVisibility");

const sunriseEl = document.getElementById("weatherSunrise");
const sunsetEl = document.getElementById("weatherSunset");
const cloudCoverEl = document.getElementById("weatherCloudCover");
const rainChanceEl = document.getElementById("weatherRainChance");

const forecastContainer = document.getElementById("weatherForecastContainer");
const btnHourly = document.getElementById("btnHourlyForecast");
const btn7Day = document.getElementById("btn7DayForecast");

let forecastListData = [];
let activeTab = "hourly";

// Image mapping helper
function getWeatherImage(condition) {
    switch (condition) {
        case "Clear":
            return "../assets/sun.png";
        case "Clouds":
            return "../assets/cloudy.png";
        case "PartlyCloudy":
            return "../assets/cloudy-sun.png";
        case "Rain":
        case "Drizzle":
            return "../assets/rainy-day.png";
        case "Thunderstorm":
            return "../assets/thunderstorm.png";
        case "Snow":
            return "../assets/snowy.png";
        case "Haze":
        case "Mist":
        case "Fog":
        case "Smoke":
        default:
            return "../assets/cloud.png";
    }
}

// Format time from Unix timestamp
function formatTime(unixSeconds) {
    const date = new Date(unixSeconds * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Format Date String for Header
function formatHeaderDate() {
    const now = new Date();
    const options = { day: 'numeric', month: 'short' };
    return `Today, ${now.toLocaleDateString('en-US', options)}`;
}

// Main initialization
window.addEventListener("DOMContentLoaded", () => {
    if (dateStrEl) dateStrEl.textContent = formatHeaderDate();

    // Event listeners for tabs
    if (btnHourly && btn7Day) {
        btnHourly.addEventListener("click", () => {
            if (activeTab !== "hourly") {
                activeTab = "hourly";
                btnHourly.classList.add("active");
                btn7Day.classList.remove("active");
                renderForecast();
            }
        });

        btn7Day.addEventListener("click", () => {
            if (activeTab !== "weekly") {
                activeTab = "weekly";
                btn7Day.classList.add("active");
                btnHourly.classList.remove("active");
                renderForecast();
            }
        });
    }

    getUserLocation();
});

// Location detection
const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Geocode city name
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
                    const data = await res.json();
                    const city = data.address.city || data.address.town || data.address.state || "Location";
                    const country = data.address.country || "";
                    if (locationNameEl) locationNameEl.textContent = `${city}, ${country}`;
                } catch (e) {
                    console.log("Geocoding fallback", e);
                }

                fetchWeatherDetails(lat, lon);
            },
            (error) => {
                console.warn("Geolocation warning:", error.message);
                fetchLocationByIP();
            },
            { timeout: 6000 }
        );
    } else {
        fetchLocationByIP();
    }
};

const fetchLocationByIP = async () => {
    try {
        const res = await fetch("https://api.ipapi.is/");
        const data = await res.json();
        if (locationNameEl) locationNameEl.textContent = `${data.city}, ${data.country || data.regionName}`;
        fetchWeatherDetails(data.location.latitude, data.location.longitude);
    } catch (err) {
        console.error("IP Location Fallback Error:", err);
        // Default to Karachi coordinates if all fails
        fetchWeatherDetails(24.8607, 67.0011);
    }
};

// Fetch current weather and 5-day forecast
async function fetchWeatherDetails(lat, lon) {
    try {
        // 1. Current Weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        const currentRes = await fetch(currentWeatherUrl);
        const currentData = await currentRes.json();

        // Update Hero Card
        const mainCond = currentData.weather[0].main;
        const tempVal = Math.round(currentData.main.temp);
        const feelsVal = Math.round(currentData.main.feels_like);

        if (mainTempEl) mainTempEl.innerHTML = `${tempVal}<span class="deg">°C</span>`;
        if (condTitleEl) condTitleEl.textContent = currentData.weather[0].description || mainCond;
        if (feelsLikeEl) feelsLikeEl.textContent = `Feels like ${feelsVal}°C`;
        if (mainImgEl) mainImgEl.src = getWeatherImage(mainCond);

        if (humidityEl) humidityEl.textContent = `${currentData.main.humidity}%`;
        if (windEl) windEl.textContent = `${Math.round(currentData.wind.speed * 3.6)} km/h`;
        if (pressureEl) pressureEl.textContent = `${currentData.main.pressure} hPa`;
        if (visibilityEl) visibilityEl.textContent = `${(currentData.visibility / 1000).toFixed(1)} km`;

        // Atmospheric Highlights
        if (sunriseEl) sunriseEl.textContent = formatTime(currentData.sys.sunrise);
        if (sunsetEl) sunsetEl.textContent = formatTime(currentData.sys.sunset);
        if (cloudCoverEl) cloudCoverEl.textContent = `${currentData.clouds.all}%`;

        // 2. Forecast Data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        forecastListData = forecastData.list || [];

        // Rain Probability from first item
        const firstPop = forecastListData[0]?.pop || 0;
        if (rainChanceEl) rainChanceEl.textContent = `${Math.round(firstPop * 100)}%`;

        renderForecast();

    } catch (error) {
        console.error("Error fetching weather page data:", error);
    }
}

// Render Forecast items
function renderForecast() {
    if (!forecastContainer) return;
    forecastContainer.innerHTML = "";

    if (activeTab === "hourly") {
        // Show first 6-7 hourly slots (3-hour intervals)
        const hourlyItems = forecastListData.slice(0, 7);
        hourlyItems.forEach((item, idx) => {
            const timeDate = new Date(item.dt * 1000);
            const timeLabel = idx === 0 ? "Now" : timeDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });
            const cond = item.weather[0].main;
            const temp = Math.round(item.main.temp);
            const imgSrc = getWeatherImage(cond);

            const cardHtml = `
                <div class="forecast-item-card ${idx === 0 ? 'active-item' : ''}">
                    <p class="forecast-time">${timeLabel}</p>
                    <img src="${imgSrc}" class="forecast-icon" alt="${cond}">
                    <p class="forecast-temp">${temp}°</p>
                </div>
            `;
            forecastContainer.insertAdjacentHTML("beforeend", cardHtml);
        });
    } else {
        // Group by day for 7-day forecast
        const dailyMap = {};
        forecastListData.forEach((item) => {
            const dayName = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
            if (!dailyMap[dayName]) {
                dailyMap[dayName] = {
                    temps: [],
                    cond: item.weather[0].main
                };
            }
            dailyMap[dayName].temps.push(item.main.temp);
        });

        Object.keys(dailyMap).forEach((day, idx) => {
            const temps = dailyMap[day].temps;
            const maxTemp = Math.round(Math.max(...temps));
            const minTemp = Math.round(Math.min(...temps));
            const cond = dailyMap[day].cond;
            const imgSrc = getWeatherImage(cond);

            const cardHtml = `
                <div class="forecast-item-card ${idx === 0 ? 'active-item' : ''}">
                    <p class="forecast-time">${idx === 0 ? 'Today' : day}</p>
                    <img src="${imgSrc}" class="forecast-icon" alt="${cond}">
                    <p class="forecast-temp">${maxTemp}° / ${minTemp}°</p>
                </div>
            `;
            forecastContainer.insertAdjacentHTML("beforeend", cardHtml);
        });
    }
}
