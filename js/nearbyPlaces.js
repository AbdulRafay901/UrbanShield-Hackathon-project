
// 1. Config Object (Wahi purana)
const PLACE_CONFIG = {
    hospital: { label: "Hospital", icon: "ri-hospital-fill", color: "danger" },
    pharmacy: { label: "Pharmacy", icon: "ri-add-box-fill", color: "success" },
    police:   { label: "Police Station", icon: "ri-shield-star-fill", color: "primary" },
    fuel:     { label: "Fuel Station", icon: "ri-gas-station-fill", color: "warning" },
    atm:      { label: "ATM", icon: "ri-bank-card-fill", color: "info" }
};

// 2. Distance Calculator (Formula)
const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(1);
};


const renderPlacesUI = (placesData, container) => {
    const cardsHTML = Object.values(placesData).map(place => `
        <div class="place-card">
            <div class="icon-wrapper text-${place.color} bg-${place.color}-soft">
                <i class="${place.icon}"></i>
            </div>
            <h6 class="text-white text-truncate" style="max-width: 90px;" title="${place.name}">
                ${place.name}
            </h6>
            <span>${place.distance} km</span>
        </div>
    `).join('');

    container.innerHTML = cardsHTML + `
        <div class="place-card d-flex align-items-center justify-content-center" style="background: transparent; border: 1px dashed var(--border);">
            <i class="ri-arrow-right-s-line text-muted fs-4"></i>
        </div>
    `;
};

// Main Fetch Function
// Main Fetch Function (Geoapify)
export const fetchNearbyPlaces = async (lat, lon) => {
    const container = document.querySelector("#nearbyPlacesContainer");
    if (!container) return;

    const cacheKey = `nearby_data_${Math.round(lat)}_${Math.round(lon)}`;

    // LocalStorage Cache
    const cachedDataString = localStorage.getItem(cacheKey);

    if (cachedDataString) {
        console.log("⚡ Data LocalStorage se aaraha hai!");
        renderPlacesUI(JSON.parse(cachedDataString), container);
        return;
    }

    container.innerHTML = `<span class="text-muted small">Locating nearby places...</span>`;

    // Replace with your API Key
    const API_KEY = "ca4b98b697334b8db96edb47ca6ef377";

    const categories = [
        "healthcare.hospital",
        "healthcare.pharmacy",
        "service.police",
        "service.financial.atm",
        "service.vehicle.fuel"
    ].join(",");

    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},3000&limit=50&apiKey=${API_KEY}`;

    try {
        const res = await fetch(url);

        if (!res.ok) throw new Error("Geoapify API Error");

        const data = await res.json();

        if (!data.features || data.features.length === 0) {
            renderFallbackPlaces(container);
            return;
        }

        const processedPlaces = {};

        data.features.forEach(place => {

            const props = place.properties;

            let type = "";

            if (props.categories.includes("healthcare.hospital")) type = "hospital";
            else if (props.categories.includes("healthcare.pharmacy")) type = "pharmacy";
            else if (props.categories.includes("service.police")) type = "police";
            else if (props.categories.includes("service.vehicle.fuel")) type = "fuel";
            else if (props.categories.includes("service.financial.atm")) type = "atm";

            if (!type || !PLACE_CONFIG[type]) return;

            const dist = parseFloat(
                calcDistance(
                    lat,
                    lon,
                    props.lat,
                    props.lon
                )
            );

            if (!processedPlaces[type] || dist < processedPlaces[type].distance) {
                processedPlaces[type] = {
                    name: props.name || PLACE_CONFIG[type].label,
                    distance: dist,
                    ...PLACE_CONFIG[type]
                };
            }
        });

        if (Object.keys(processedPlaces).length === 0) {
            renderFallbackPlaces(container);
            return;
        }

        localStorage.setItem(cacheKey, JSON.stringify(processedPlaces));

        renderPlacesUI(processedPlaces, container);

    } catch (err) {
        console.error("Geoapify Error:", err);
        renderFallbackPlaces(container);
    }
};
// Fallback Function
const renderFallbackPlaces = (container) => {
    container.innerHTML = Object.values(PLACE_CONFIG).map(place => `
        <div class="place-card">
            <div class="icon-wrapper text-${place.color} bg-${place.color}-soft">
                <i class="${place.icon}"></i>
            </div>
            <h6 class="text-white">${place.label}</h6>
            <span>-- km</span>
        </div>
    `).join('') + `
        <div class="place-card d-flex align-items-center justify-content-center" style="background: transparent; border: 1px dashed var(--border);">
            <i class="ri-arrow-right-s-line text-muted fs-4"></i>
        </div>
    `;
};