


// Initialize Sidebar Tab Click Handlers
document.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;

    const page = tab.getAttribute("data-page");
    const isPagesDir = window.location.pathname.includes("/pages/");

    if (page === "dashboard") {
        window.location.href = isPagesDir ? "../index.html" : "index.html";
    } else if (page === "weather") {
        window.location.href = isPagesDir ? "weatherPage.html" : "pages/weatherPage.html";
    } else if (page === "air-quality") {
        window.location.href = isPagesDir ? "airQualityPage.html" : "pages/airQualityPage.html";
    } else if (page === "map") {
        window.location.href = isPagesDir ? "mapPage.html" : "pages/mapPage.html";
    } else if (page === "emergency") {
        window.location.href = isPagesDir ? "emergencyPage.html" : "pages/emergencyPage.html";
    } else if (page === "analytics") {
        window.location.href = isPagesDir ? "analyticsPage.html" : "pages/analyticsPage.html";
    } else if (page === "alerts") {
        window.location.href = isPagesDir ? "alertsPage.html" : "pages/alertsPage.html";
    } else if (page === "settings") {
        window.location.href = isPagesDir ? "setting.html" : "pages/setting.html";
    }
});

// Mobile Sidebar Toggle Handler
document.addEventListener("click", (e) => {
    const toggleFill = document.querySelector("#fill");
    const sidebar = document.querySelector("#sidebarComponent");
    
    if (e.target && e.target.id === "fill" && sidebar && toggleFill) {
        toggleFill.classList.add("fill-js");
        sidebar.classList.add("sidebar-js");
    } else if (e.target && e.target.id === "line" && sidebar && toggleFill) {
        toggleFill.classList.remove("fill-js");
        sidebar.classList.remove("sidebar-js");
    }
});







// Safety Score --------------------------- Start



const state = {
    weather: null,
    temp: null,
    uv: null,
    aqi: null,
};

const WEATHER_PENALTY = {
    Rain: 10,
    Drizzle: 10,
    Thunderstorm: 25,
    Snow: 15,
    Mist: 10,
    Fog: 10,
    Haze: 10,
};

const ZONES = [
    {
        min: 90,
        text: "Excellent",
        icon: "ri-checkbox-circle-fill",
        color: "text-success",
        classList: "safety-circle-90" 
    },
    {
        min: 75,
        text: "Safe Zone",
        icon: "ri-checkbox-circle-fill",
        color: "text-success",
        classList: "safety-circle-75" 
    },
    {
        min: 60,
        text: "Moderate",
        icon: "ri-error-warning-fill",
        color: "text-warning",
        classList: "safety-circle-60" 
    },
    {
        min: 40,
        text: "Caution",
        icon: "ri-alert-fill",
        color: "text-warning",
        classList: "safety-circle-40" 
    },
    {
        min: 0,
        text: "Unsafe Zone",
        icon: "ri-close-circle-fill",
        color: "text-danger",
        classList: "safety-circle-0" 
    },
];

export function updateWeatherScore(weather, temp) {
    state.weather = weather;
    state.temp = temp;
    calculate();
}

export function updateUvScore(uv) {
    state.uv = uv;
    calculate();
}

export function updateAirScore(aqi) {
    state.aqi = aqi;
    calculate();
}

function calculate() {

    
const scoreElement = document.getElementById("safetyScoreValue");
const zoneText = document.querySelector(".safety-zone p");
const zoneIcon = document.querySelector(".safety-zone i");
const safeyCircle = document.querySelector(".safety-score .circle")

    if (Object.values(state).includes(null)) return;

    let score = 100;

    score -= WEATHER_PENALTY[state.weather] || 0;

    if (state.temp >= 40) score -= 20;
    else if (state.temp >= 35) score -= 10;

    if (state.temp <= 5) score -= 15;
    else if (state.temp <= 12) score -= 8;

    if (state.uv >= 11) score -= 30;
    else if (state.uv >= 8) score -= 20;
    else if (state.uv >= 6) score -= 10;
    else if (state.uv >= 3) score -= 5;

    score -= [0, 0, 5, 10, 20, 35][state.aqi] || 0;

    score = Math.max(score, 0);

    scoreElement.textContent = score;

    const zone = ZONES.find(z => score >= z.min);

    zoneText.textContent = zone.text;
    zoneIcon.className = `${zone.icon} me-1 ${zone.color} fs-6`;
    safeyCircle.classList.add(`${zone.classList}`)
    
}


// Safety Score --------------------------- End