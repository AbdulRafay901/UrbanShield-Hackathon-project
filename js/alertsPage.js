import { WEATHER_API_KEY } from "../config.js";

// DOM Element Selection
const alertsContainer = document.querySelector(".alerts-feed-container");

// 1. Loading Spinner Function
function showLoadingState() {
    if (!alertsContainer) return;
    alertsContainer.innerHTML = `
        <div class="text-center py-5 id="alertsLoader"">
            <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem;">
                <span class="visually-hidden">Loading alerts...</span>
            </div>
            <p class="mt-3 text-muted fs-6">Fetching live safety alerts for your location...</p>
        </div>
    `;
}

// Helper: Format Current Date & Time for Alert Cards
function formatAlertTime() {
    const now = new Date();
    const optionsDate = { day: 'numeric', month: 'short' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    return `${now.toLocaleDateString('en-US', optionsDate)}, ${now.toLocaleTimeString('en-US', optionsTime)}`;
}

window.addEventListener("DOMContentLoaded", () => {
    initAlertFilters();
    getUserLocationAlerts(); 
});

// Location detection
const getUserLocationAlerts = () => {
    showLoadingState(); // Step 1: Location aur Data fetch hone tak loader dikhao

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchRealTimeAlerts(lat, lon);
            },
            () => {
                console.warn("Geolocation fallback for alerts.");
                fetchLocationByIPAlerts();
            },
            { timeout: 6000 }
        );
    } else {
        fetchLocationByIPAlerts();
    }
};

// Fallback to IP
const fetchLocationByIPAlerts = async () => {
    try {
        const res = await fetch("https://api.ipapi.is/");
        const data = await res.json();
        fetchRealTimeAlerts(data.location.latitude, data.location.longitude);
    } catch (err) {
        // Default Coordinates (Karachi)
        fetchRealTimeAlerts(24.8607, 67.0011); 
    }
};

// Main Function to Fetch and Render Alerts
const fetchRealTimeAlerts = async (lat, lon) => {
    try {
        // Fetching weather, AQI & UV in parallel for fast loading
        const [weatherRes, aqiRes, uvRes] = await Promise.allSettled([
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`),
            fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`),
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`)
        ]);

        // Step 2: Data aate hi Loader ko Hata do
        if (alertsContainer) alertsContainer.innerHTML = "";

        // Track alerts count
        let alertCount = 0;

        // 1. Weather Logic (Rain / Heat / Cold)
        if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
            const weatherData = await weatherRes.value.json();
            const currentW = weatherData.list[0];
            const temp = currentW.main.temp;
            const pop = currentW.pop || 0;
            const rainChance = Math.round(pop * 100);

            if (rainChance >= 40) {
                renderAlert("weather", "border-left-primary", "bg-primary-soft text-primary", "ri-rainy-line", "Rain Alert", `Rain chance is ${rainChance}%. Carry an umbrella!`);
                alertCount++;
            }
            if (temp >= 38) {
                renderAlert("weather", "border-left-danger", "bg-danger-soft text-danger", "ri-fire-line", "Heat Alert", `High temperature (${Math.round(temp)}°C). Drink plenty of water!`);
                alertCount++;
            } else if (temp <= 15) {
                renderAlert("weather", "border-left-info", "bg-info-soft text-info", "ri-temp-cold-line", "Cold Alert", `Chilly weather (${Math.round(temp)}°C). Wear a jacket!`);
                alertCount++;
            }
        }

        // 2. Air Quality Logic
        if (aqiRes.status === "fulfilled" && aqiRes.value.ok) {
            const aqiData = await aqiRes.value.json();
            const aqiVal = aqiData.current ? Math.round(aqiData.current.us_aqi) : 50;

            let aqiStatus = "Good";
            if (aqiVal > 150) aqiStatus = "Unhealthy";
            else if (aqiVal > 100) aqiStatus = "Unhealthy for Sensitive Groups";
            else if (aqiVal > 50) aqiStatus = "Moderate";

            renderAlert(
                "air-quality", 
                aqiVal > 100 ? "border-left-warning" : "border-left-success", 
                aqiVal > 100 ? "bg-warning-soft text-warning" : "bg-success-soft text-success", 
                "ri-windy-line", 
                "Air Quality Alert", 
                `Current AQI is ${aqiVal} (${aqiStatus}).`
            );
            alertCount++;
        }

        // 3. UV Logic
        if (uvRes.status === "fulfilled" && uvRes.value.ok) {
            const uvData = await uvRes.value.json();
            const uvIndex = Math.round(uvData.current.uv_index);

            if (uvIndex >= 3 && uvIndex <= 5) {
                renderAlert("weather", "border-left-warning", "bg-warning-soft text-warning", "ri-sun-cloudy-line", "Moderate UV Alert", `UV Index is ${uvIndex}. Wear sunscreen & sunglasses.`);
                alertCount++;
            } else if (uvIndex >= 6 && uvIndex <= 7) {
                renderAlert("weather", "border-left-warning", "bg-warning-soft text-warning", "ri-sun-line", "High UV Alert", `UV Index is High (${uvIndex}). Use SPF 30+ sunscreen & wear a hat.`);
                alertCount++;
            } else if (uvIndex >= 8) {
                renderAlert("weather", "border-left-danger", "bg-danger-soft text-danger", "ri-alarm-warning-fill", "Very High UV Alert", `UV Danger (${uvIndex})! Avoid direct sun exposure.`);
                alertCount++;
            }
        }

        // 4. System Security Alert
        renderAlert("system", "border-left-info", "bg-info-soft text-info", "ri-shield-check-line", "System Security Active", "UrbanShield safety score is actively monitoring your area.");
        alertCount++;

    } catch (error) {
        console.error("Error fetching real-time alerts:", error);
        if (alertsContainer) {
            alertsContainer.innerHTML = `<div class="p-3 text-center text-danger">Failed to load real-time alerts. Please refresh the page.</div>`;
        }
    }
};

// Card Component Renderer
function renderAlert(category, borderClass, iconBoxClass, iconClass, title, desc) {
    if (!alertsContainer) return;
    
    const timeNow = formatAlertTime();
    
    const alertHtml = `
        <div class="alert-feed-card ${borderClass}" data-category="${category}">
            <div class="alert-card-left">
                <div class="alert-icon-box ${iconBoxClass}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="alert-card-info">
                    <h6>${title}</h6>
                    <p>${desc}</p>
                </div>
            </div>
            <div class="alert-card-time">${timeNow}</div>
        </div>
    `;
    alertsContainer.insertAdjacentHTML("beforeend", alertHtml);
}

// Category Tabs Filter
function initAlertFilters() {
    const tabBtns = document.querySelectorAll(".alert-tab-btn");
    
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const selectedCat = btn.getAttribute("data-category");
            const alertCards = document.querySelectorAll(".alert-feed-card");

            alertCards.forEach(card => {
                const cardCat = card.getAttribute("data-category");
                if (selectedCat === "all" || cardCat === selectedCat) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}