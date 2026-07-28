
import { fetchWeatherData } from "./weather.js";
import { fetchAirData } from "./airQuality.js";
import { fetchUvData } from "./uv.js";
import { fetchNearbyPlaces } from "./nearbyPlaces.js";
import { fetchChartData } from "./todayOverview.js";


// Search bar 

const searchInput = document.querySelector(".search-container input");

searchInput.addEventListener("keypress", async (e) => {

    if (e.key !== "Enter") return;

    const city = searchInput.value.trim();

    if (!city) return;

    searchCity(city);

});


const searchCity = async (city) => {

    try {

        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
        );

        const data = await res.json();

        if (!data.length) {
            alert("City not found");
            return;
        }

        const lat = data[0].lat;
        const lon = data[0].lon;

        location_name.textContent = `${data[0].display_name}`;

        fetchWeatherData(lat, lon);
        fetchAirData(lat, lon);
        fetchUvData(lat, lon);
        fetchNearbyPlaces(lat, lon);
        fetchChartData(lat, lon);


        searchInput.value = "";

    } catch (err) {

        console.log(err);

    }

};


// SIde Bar


const sidebarload = async () => {

  const res = await fetch('components/sidebar.html')

  const data = await res.text()
    
        const sidebarContainer = document.getElementById("sidebarComponent");
        if (sidebarContainer) {
            sidebarContainer.innerHTML = data;

            loadSidebar()
        }    

}

sidebarload()

    function loadSidebar(){

        const scoreElement = document.querySelector("#safetyScoreValue");
        const zoneText = document.querySelector(".safety-zone p");
        const zoneIcon = document.querySelector(".safety-zone i");
        const safeyCircle = document.querySelector(".safety-score .circle")

        let safetyScore = JSON.parse(localStorage.getItem("safetyscore"));
    
        scoreElement.textContent = safetyScore.val
        zoneText.textContent = safetyScore.text
        zoneIcon.className = safetyScore.icon
        safeyCircle.classList.add(safetyScore.color)
    }

    const toggleFill = document.querySelector("#fill");
    const toggleLine = document.querySelector("#line")
    const sidebar = document.querySelector("#sidebarComponent");


 


toggleFill.addEventListener("click", () => {

    toggleFill.classList.add("fill-js")
    sidebar.classList.add("sidebar-js")
    

})

window.addEventListener("click", ((e) => {
    if(e.target.id == "line"){
    toggleFill.classList.remove("fill-js")
    sidebar.classList.remove("sidebar-js")
    }
}))


// SIde Bar

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

