


import { fetchWeatherData } from "./weather.js";
import { fetchAirData } from "./airQuality.js";
import { fetchUvData } from "./uv.js";
import { fetchNearbyPlaces } from "./nearbyPlaces.js";

let location_name = document.querySelector(".location-name");


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
        fetchNearbyPlaces(lat, lon)

    } catch (err) {
        
        console.error("IP Location Fail:", err);
    }
}

fetchLocationByIP()