

        import { WEATHER_API_KEY } from "../config.js";
        import { AIR_API_KEY } from "../config.js";

        // Premium Chart Setup matching the image perfectly
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
                plugins: { legend: { display: false } }, // Custom legend used in HTML
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



        // Website load hote hi ye function chalega
window.onload = function() {
    getUserLocation();
};

function getUserLocation() {
    // Check agar browser Geolocation support karta hai
    if (navigator.geolocation) {
        
        // Timeout option add kiya hai taakay zyada dair load na ho
        const options = {
            enableHighAccuracy: true,
            timeout: 5000, 
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
           
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log("Success! Latitude:", lat, "Longitude:", lon);


                fetchWeatherData(lat, lon);
                fetchAirData(lat, lon)
                
                
            },
            
            
            function(error) {
                console.warn("Location denied or error:", error.message);
                console.log("Switching to Fallback IP Location...");
                
                fetchLocationByIP();
            },
            options
        );
    } else {
        console.error("Aapka browser geolocation support nahi karta.");
        fetchLocationByIP();
    }
}


function fetchLocationByIP() {
    
    fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
            console.log("Fallback Success! City:", data.city);
            const lat = data.lat;
            const lon = data.lon;


            fetchWeatherData(lat, lon)
            fetchAirData(lat, lon)
            
            
        })
        .catch(err => {
            console.error("IP Location bhi fail ho gayi:", err);
           
        });
}



// Weather Api ------------------- Start


const elements = {
  temp: document.querySelector(".display-3"),
  wind: document.querySelector(".windspeed"),
  name: document.querySelector(".name"),
  feels: document.querySelector(".feels-like"),
  humidity: document.querySelector(".humidity"),
  pressure: document.querySelector(".pressure"),
  visibility: document.querySelector(".visiblity"),
};


 const fetchWeatherData = async (lat,lon) =>{

    try {

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

        const res = await fetch(url)

        const data = await res.json();

            const temp = data.main.temp;
            const windspeed = data.wind.speed;
            const name = data.weather[0].main;
            const feels_like = data.main.feels_like;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const visiblity = data.visibility;
            
            elements.temp.innerHTML = `${temp} <span class="fs-2 fw-normal">°C</span>`;
            elements.wind.innerHTML = `${windspeed} <span style="font-size:12px;">km/h</span>`;
            elements.name.textContent = name;
            elements.feels.textContent = `${feels_like} °C`;
            elements.humidity.textContent = `${humidity}%`;
            elements.pressure.innerHTML = `${pressure} <span style="font-size:12px;">hPa</span>`;
            elements.visibility.innerHTML = `${visiblity} <span style="font-size:12px;">km</span>`;
        
    } catch (error) {

        console.log(error)
        
    }
}



const fetchAirData = async (lat,lon) => {

    const element = {
        aqi: document.querySelector(".aqi"),
        air_level: document.querySelector(".air-level"),
        air_circle: document.querySelector(".air-circle")
    }

    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`


    const res = await fetch(url)
    const data = await res.json()
    console.log(data)

    const aqi = element.aqi.textContent = data.list[0].main.aqi;


        switch(aqi){
            case 1:
                console.log("Good")
            break;
            case 2:
                console.log("Fair")
            break;
            case 3:
                console.log("Moderate")
            break;
            case 4:
                element.air_level.innerHTML = "Poor"
                element.air_level.classList.add("air-level-js")
                element.air_circle.classList.add("air-circle-js")
            break;
            case 5:
                console.log("very poor")
            break;
            
        }
    

}
