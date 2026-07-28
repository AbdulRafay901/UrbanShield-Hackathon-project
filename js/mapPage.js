// Config object for place types
const CATEGORY_CONFIG = {
    hospital: { label: "Hospital", icon: "ri-hospital-fill", color: "danger", dotClass: "dot-red", bgSoft: "bg-danger-soft", pinColor: "#EF4444" },
    pharmacy: { label: "Pharmacy", icon: "ri-add-box-fill", color: "success", dotClass: "dot-green", bgSoft: "bg-success-soft", pinColor: "#10B981" },
    police:   { label: "Police Station", icon: "ri-shield-star-fill", color: "primary", dotClass: "dot-blue", bgSoft: "bg-primary-soft", pinColor: "#2563EB" },
    fuel:     { label: "Fuel Station", icon: "ri-gas-station-fill", color: "warning", dotClass: "dot-orange", bgSoft: "bg-warning-soft", pinColor: "#F59E0B" },
    atm:      { label: "ATM", icon: "ri-bank-card-fill", color: "info", dotClass: "dot-purple", bgSoft: "bg-dark-soft", pinColor: "#8B5CF6" }
};

let leafletMap = null;
let userCoords = { lat: 24.8607, lon: 67.0011 }; // Default fallback (Karachi)
let mapMarkers = [];
let allPlacesData = [];
let currentCategory = "all";

// Distance Calculator
function calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(1);
}

window.addEventListener("DOMContentLoaded", () => {
    initCategoryFilters();
    getUserLocation();
});

// Filter Chips event listeners
function initCategoryFilters() {
    const chips = document.querySelectorAll(".map-filter-chip");
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            currentCategory = chip.getAttribute("data-category");
            filterPlacesAndPins();
        });
    });
}

// Geolocation
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userCoords.lat = pos.coords.latitude;
                userCoords.lon = pos.coords.longitude;
                initMapAndFetchPlaces();
            },
            (err) => {
                console.warn("Geolocation fallback:", err.message);
                fetchLocationByIP();
            },
            { timeout: 6000 }
        );
    } else {
        fetchLocationByIP();
    }
}

async function fetchLocationByIP() {
    try {
        const res = await fetch("https://api.ipapi.is/");
        const data = await res.json();
        userCoords.lat = data.location.latitude;
        userCoords.lon = data.location.longitude;
    } catch (e) {
        console.warn("IP location fallback used default");
    }
    initMapAndFetchPlaces();
}

// Initialize Leaflet Map
function initMapAndFetchPlaces() {
    const mapViewportEl = document.getElementById("mapViewport");
    if (!mapViewportEl) return;

    if (typeof L !== 'undefined') {
        leafletMap = L.map('mapViewport', {
            center: [userCoords.lat, userCoords.lon],
            zoom: 14,
            zoomControl: false
        });

        // Add CartoDB Dark Matter map tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(leafletMap);

        // Add User Location Pulsing Marker
        const userIcon = L.divIcon({
            className: 'user-pulse-marker',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });
        L.marker([userCoords.lat, userCoords.lon], { icon: userIcon })
            .addTo(leafletMap)
            .bindPopup("<b>You are here</b>");
    }

    fetchNearbyPlacesFromAPI();
}

// Fetch places using Overpass API
async function fetchNearbyPlacesFromAPI() {
    const { lat, lon } = userCoords;
    const query = `[out:json][timeout:10];
        (node["amenity"~"hospital|pharmacy|police|fuel|atm"](around:4000, ${lat}, ${lon}););
        out body 12;`;

    try {
        const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data && data.elements && data.elements.length > 0) {
            allPlacesData = data.elements.map(place => {
                const type = place.tags?.amenity || "hospital";
                const config = CATEGORY_CONFIG[type] || CATEGORY_CONFIG.hospital;
                const dist = calcDistance(lat, lon, place.lat, place.lon);
                return {
                    id: place.id,
                    name: place.tags.name || config.label,
                    type: type,
                    lat: place.lat,
                    lon: place.lon,
                    distance: parseFloat(dist),
                    ...config
                };
            });
            // Sort by distance
            allPlacesData.sort((a, b) => a.distance - b.distance);
        } else {
            generateFallbackPlaces();
        }
    } catch (err) {
        console.warn("Overpass API error, generating fallback nearby places:", err);
        generateFallbackPlaces();
    }

    renderMapPins();
    renderPlacesList();
}

// Fallback places generator near user coordinates
function generateFallbackPlaces() {
    const { lat, lon } = userCoords;
    allPlacesData = [
        { id: 1, name: "City Hospital", type: "hospital", lat: lat + 0.005, lon: lon + 0.004, distance: 0.8, ...CATEGORY_CONFIG.hospital },
        { id: 2, name: "Life Pharmacy", type: "pharmacy", lat: lat - 0.004, lon: lon + 0.003, distance: 0.6, ...CATEGORY_CONFIG.pharmacy },
        { id: 3, name: "Saddar Police Station", type: "police", lat: lat + 0.008, lon: lon - 0.006, distance: 1.2, ...CATEGORY_CONFIG.police },
        { id: 4, name: "Shell Fuel Station", type: "fuel", lat: lat - 0.006, lon: lon - 0.005, distance: 0.9, ...CATEGORY_CONFIG.fuel },
        { id: 5, name: "Central ATM", type: "atm", lat: lat + 0.003, lon: lon - 0.002, distance: 0.5, ...CATEGORY_CONFIG.atm }
    ];
}

// Filter places and pins based on selected category chip
function filterPlacesAndPins() {
    renderMapPins();
    renderPlacesList();
}

// Render pins on Leaflet Map
function renderMapPins() {
    if (!leafletMap || typeof L === 'undefined') return;

    // Clear existing markers
    mapMarkers.forEach(m => leafletMap.removeLayer(m));
    mapMarkers = [];

    const filtered = currentCategory === "all" 
        ? allPlacesData 
        : allPlacesData.filter(p => p.type === currentCategory);

    filtered.forEach(place => {
        const pinIcon = L.divIcon({
            className: 'custom-pin-wrapper',
            html: `<div class="custom-place-pin" style="background-color: ${place.pinColor}">
                    <i class="${place.icon}"></i>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker([place.lat, place.lon], { icon: pinIcon })
            .addTo(leafletMap)
            .bindPopup(`<b>${place.name}</b><br><small>${place.label} • ${place.distance} km</small>`);

        mapMarkers.push(marker);
    });
}

// Render list below the map
function renderPlacesList() {
    const listEl = document.getElementById("nearbyPlacesList");
    if (!listEl) return;

    const filtered = currentCategory === "all" 
        ? allPlacesData 
        : allPlacesData.filter(p => p.type === currentCategory);

    if (filtered.length === 0) {
        listEl.innerHTML = `<div class="text-center py-4 text-muted small">No places found in this category.</div>`;
        return;
    }

    listEl.innerHTML = filtered.map(place => `
        <div class="place-list-item" onclick="focusOnPlace(${place.lat}, ${place.lon})">
            <div class="place-item-left">
                <div class="place-icon-badge text-${place.color} ${place.bgSoft}">
                    <i class="${place.icon}"></i>
                </div>
                <div class="place-item-info">
                    <h6>${place.name}</h6>
                    <small>${place.label}</small>
                </div>
            </div>
            <div class="place-distance">${place.distance} km</div>
        </div>
    `).join('');
}

// Focus map view on list item click
window.focusOnPlace = (lat, lon) => {
    if (leafletMap) {
        leafletMap.flyTo([lat, lon], 16, { duration: 1 });
    }
};
