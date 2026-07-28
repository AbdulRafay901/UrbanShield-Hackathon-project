
fetch('components/sidebar.html')
    .then(response => response.text())
    .then(data => {
        const sidebarContainer = document.getElementById("sidebarComponent");
        if (sidebarContainer) {
            sidebarContainer.innerHTML = data;
            initSidebarNavigation();
        }
    })
    .catch(err => console.error("Error loading sidebar component:", err));

// Initialize Sidebar Tab Click Handlers


// Responsive Sidebar ------------ Start

// Responsive Sidebar ------------ End


window.initSidebarNavigation = initSidebarNavigation;




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