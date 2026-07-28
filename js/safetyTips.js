// DOM Container
const tipsContainer = document.querySelector(".safety-tips-container");

// Tips Array
let tips = [];


function addTip(icon, color, title, desc) {
    
    const alreadyExists = tips.find(t => t.title === title);

    if (alreadyExists) return;

    tips.push({
        icon,
        color,
        title,
        desc
    });
}

// Render Tips
function renderTips() {

    if (!tipsContainer) return;

    tipsContainer.innerHTML = "";

    if (tips.length === 0) {

    addTip(
        "ri-checkbox-circle-fill",
        "success",
        "Weather looks pleasant",
        "Enjoy your outdoor activities."
    );

}

     const priority = {
         danger: 1,
         warning: 2,
         primary: 3,
         success: 4,
         info: 5
     };

tips.sort((a, b) => priority[a.color] - priority[b.color]);

    tips.slice(0, 4).forEach(tip => {

        tipsContainer.innerHTML += `
        
        <div class="tip-item d-flex gap-3 align-items-center">

            <div class="icon-wrapper text-${tip.color} bg-${tip.color}-soft rounded-circle">
                <i class="${tip.icon}"></i>
            </div>

            <div>
                <h6 class="text-white mb-1" style="font-size:13px;">
                    ${tip.title}
                </h6>

                <p class="text-muted mb-0" style="font-size:11px;">
                    ${tip.desc}
                </p>
            </div>

        </div>

        `;
    });

}

// Clear Old Tips
export function clearSafetyTips() {
    tips = [];
}

// Weather Tips
export function weatherTips(weather, temp, humidity, wind) {

    console.log(weather, temp, humidity, wind);

    if (weather === "Rain" || weather === "Drizzle") {

        addTip(
            "ri-umbrella-fill",
            "primary",
            "Carry an umbrella",
            "Rain expected today."
        );
    }

    if (weather === "Thunderstorm") {

        addTip(
            "ri-flashlight-fill",
            "danger",
            "Stay indoors",
            "Thunderstorm is expected."
        );
    }

    if (temp >= 35) {

        addTip(
            "ri-drop-fill",
            "warning",
            "Stay hydrated",
            "Drink plenty of water."
        );
    }

    if (temp <= 12) {

        addTip(
            "ri-shirt-fill",
            "info",
            "Wear warm clothes",
            "Cold weather today."
        );
    }

    if (humidity >= 85) {

        addTip(
            "ri-water-percent-fill",
            "info",
            "High humidity",
            "Stay cool and hydrated."
        );
    }

    if (wind >= 30) {

        addTip(
            "ri-windy-fill",
            "success",
            "Strong winds",
            "Secure loose objects."
        );
    }

    renderTips();

}

// UV Tips
export function uvTips(uv) {

    if (uv >= 6) {

        addTip(
            "ri-sun-fill",
            "danger",
            "Use sunscreen",
            "UV index is high."
        );

    }

    renderTips();

}

// AQI Tips
export function airTips(aqi) {

    if (aqi >= 4) {

        addTip(
            "ri-mental-health-line",
            "warning",
            "Wear a mask",
            "Poor air quality today."
        );

    }

    renderTips();

}