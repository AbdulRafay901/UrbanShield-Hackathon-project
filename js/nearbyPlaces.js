
const PLACE_CONFIG = {
    hospital: { label: "Hospital", icon: "ri-hospital-fill", color: "danger" },
    pharmacy: { label: "Pharmacy", icon: "ri-add-box-fill", color: "success" },
    police:   { label: "Police Station", icon: "ri-shield-star-fill", color: "primary" },
    fuel:     { label: "Fuel Station", icon: "ri-gas-station-fill", color: "warning" },
    atm:      { label: "ATM", icon: "ri-bank-card-fill", color: "info" }
};


const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))).toFixed(1);
};


export const fetchNearbyPlaces = async (lat, lon) => {
    const container = document.querySelector("#nearbyPlacesContainer");
    if (!container) return;

    // Overpass API Query (2km radius ke andar hospital, pharmacy, police, fuel, atm)
    const query = `[out:json][timeout:10];
        (
          node["amenity"~"hospital|pharmacy|police|fuel|atm"](around:2000, ${lat}, ${lon});
        );
        out body 10;`;

    try {
        const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!data.elements || data.elements.length === 0) {
            container.innerHTML = `<span class="text-muted small">No nearby essential places found.</span>`;
            return;
        }

        
        const processedPlaces = {};
        data.elements.forEach(place => {
            const type = place.tags.amenity;
            if (PLACE_CONFIG[type]) {
                const dist = parseFloat(calcDistance(lat, lon, place.lat, place.lon));
                
                if (!processedPlaces[type] || dist < processedPlaces[type].distance) {
                    processedPlaces[type] = {
                        name: place.tags.name || PLACE_CONFIG[type].label,
                        distance: dist,
                        ...PLACE_CONFIG[type]
                    };
                }
            }
        });

     
        const cardsHTML = Object.values(processedPlaces).map(place => `
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

    } catch (err) {
        console.error("Nearby Places Error:", err);
        renderFallbackPlaces(container);
    }
};


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