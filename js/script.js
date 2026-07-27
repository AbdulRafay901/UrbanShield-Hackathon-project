// Api Keys 

import { WEATHER_API_KEY } from "../config.js";
import { AIR_API_KEY } from "../config.js";
import { GEMINI_API_KEY } from "../config.js";

// Api Keys 


const ctx = document.getElementById('premiumChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '12 AM'],
        datasets: [
            {
                data: [65, 60, 75, 85, 80, 70, 65],
                borderColor: '#F59E0B',
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#141D34',
                pointBorderColor: '#F59E0B',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                data: [40, 38, 45, 40, 42, 45, 40],
                borderColor: '#2563EB',
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#141D34',
                pointBorderColor: '#2563EB',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                data: [20, 22, 20, 28, 25, 22, 20],
                borderColor: '#10B981',
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#141D34',
                pointBorderColor: '#10B981',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }, 
        scales: {
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: '#9BA8C8', font: { family: 'Inter', size: 11 } }
            },
            y: {
                grid: { color: 'rgba(36, 47, 74, 0.4)', drawBorder: false },
                ticks: {
                    color: '#9BA8C8',
                    font: { family: 'Inter', size: 11 },
                    stepSize: 25,
                    min: 0,
                    max: 100
                }
            }
        }
    }
});



let location_name = document.querySelector(".location-name");

window.onload = function () {
    getUserLocation();
};

const getUserLocation = async () => {
  
    if (navigator.geolocation) {

    
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(

            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                

                fetchWeatherData(lat, lon);
                fetchAirData(lat, lon)
                fetchUvData(lat,lon)

            },


            function (error) {
                console.warn("Location denied or error:", error.message);
                console.log("Switching to Fallback IP Location...");

                fetchLocationByIP();
            },
            options
        );
    } else {
        console.error("Browser Not support geolocation");
        fetchLocationByIP();
    }
}

const fetchLocationByIP = async () => {
    try {
    
        const res = await fetch('http://ip-api.com/json/');
        

        const data = await res.json();
        
        location_name.textContent = `${data.city}, ${data.regionName}`
        
        const lat = data.lat;
        const lon = data.lon;

        
        fetchWeatherData(lat, lon);
        fetchAirData(lat, lon);
        fetchUvData(lat, lon);

    } catch (err) {
        
        console.error("IP Location Fail:", err);
    }
}



