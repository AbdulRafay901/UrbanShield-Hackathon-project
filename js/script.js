
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
            
            
        })
        .catch(err => {
            console.error("IP Location bhi fail ho gayi:", err);
           
        });
}



// Weather Api ------------------- Start




function fetchWeatherData(lat, lon) {
    // Open-Meteo ko koi API key nahi chahiye hoti!


    const apiKey = "c6fb2567ff2478f8635ca6d0767f4765";


    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Open-Meteo se Data Aa Gaya:", data);
            
            const temp = data.main.temp;
            // const windspeed = data.current_weather.windspeed;
            // const temperature = data.current_weather_units.temperature;
            // const windSpeedType = data.current_weather_units.windspeed;


            document.querySelector(".display-3").innerHTML = `${temp} <span class="fs-2 fw-normal">C</span>`
            // document.querySelector(".windspeed").innerHTML =  `${windspeed} <span class="fw-normal" style="font-size:12px;">${windSpeedType}</span>`
            
            
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
