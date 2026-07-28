
import { fetchWeatherData } from "./weather.js";
import { fetchAirData } from "./airQuality.js";
import { fetchUvData } from "./uv.js";
import { fetchNearbyPlaces } from "./nearbyPlaces.js";
import { fetchChartData } from "./todayOverview.js";

let location_name = document.querySelector(".location-name");


navigator.geolocation.getCurrentPosition(async (position) => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Reverse Geocoding
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );

    const data = await res.json();

    location_name.textContent =
        `${data.address.city} ${data.address.state}`;

    fetchWeatherData(lat, lon);
    fetchAirData(lat, lon);
    fetchUvData(lat, lon);
    fetchNearbyPlaces(lat, lon);
    fetchChartData(lat, lon);

}, (error) => {
    console.log(error);

    fetchLocationByIP()
});


const fetchLocationByIP = async () => {
    try {
    
        const res = await fetch('https://api.ipapi.is/');
        
        const data = await res.json();

        console.log(data)
        

        location_name.textContent = `${data.city}, ${data.regionName}`
        
        const lat = data.location.latitude;
        const lon = data.location.longitude;

        
        fetchWeatherData(lat, lon);
        fetchAirData(lat, lon);
        fetchUvData(lat, lon);
        fetchNearbyPlaces(lat, lon)
        fetchChartData(lat, lon);

    } catch (err) {        
        console.error("IP Location Fail:", err);
    }
}

