// Api Keys 

import { WEATHER_API_KEY } from "../config.js";
import { AIR_API_KEY } from "../config.js";
import { GEMINI_API_KEY } from "../config.js";

// Api Keys 

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



