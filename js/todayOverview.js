
import { WEATHER_API_KEY } from "../config.js";


const ctx = document.getElementById('premiumChart').getContext('2d');

let weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['-', '-', '-', '-', '-', '-', '-'], // Initially empty placeholder
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [], 
                borderColor: '#F59E0B', // Orange
                tension: 0.4, borderWidth: 2, pointBackgroundColor: '#141D34', pointBorderColor: '#F59E0B', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6
            },
            {
                label: 'Humidity (%)',
                data: [], 
                borderColor: '#2563EB', // Blue
                tension: 0.4, borderWidth: 2, pointBackgroundColor: '#141D34', pointBorderColor: '#2563EB', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6
            },
            {
                label: 'Wind Speed (km/h)',
                data: [], 
                borderColor: '#10B981', // Green
                tension: 0.4, borderWidth: 2, pointBackgroundColor: '#141D34', pointBorderColor: '#10B981', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false } 
        }, 
        scales: {
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: '#9BA8C8', font: { family: 'Inter', size: 11 } }
            },
            y: {
                grid: { color: 'rgba(36, 47, 74, 0.4)', drawBorder: false },
                ticks: { color: '#9BA8C8', font: { family: 'Inter', size: 11 }, stepSize: 25, min: 0 } 
                // Note: Max 100 hata diya hai taake agar value ziada ho toh chart auto-adjust ho jaye
            }
        }
    }
});

export const fetchChartData = async (lat, lon) => {
    try {
        
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        
        const forecastList = data.list.slice(0, 7);

        const timeLabels = [];
        const tempData = [];
        const humidityData = [];
        const windData = [];

        // Data to Arrays
        forecastList.forEach(item => {
            // Time Format (E.g., 12:00 PM)
            const date = new Date(item.dt * 1000);
            let hours = date.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // 24hr to 12hr format 
            timeLabels.push(`${hours} ${ampm}`);

            // Values 
            tempData.push(Math.round(item.main.temp)); 
            humidityData.push(item.main.humidity);     
            windData.push(Math.round(item.wind.speed * 3.6)); 
        });

        // Chart Data Update 
        weatherChart.data.labels = timeLabels;
        weatherChart.data.datasets[0].data = tempData;     
        weatherChart.data.datasets[1].data = humidityData;  
        weatherChart.data.datasets[2].data = windData;     

       
        weatherChart.update();

    } catch (error) {
        console.error("Chart Data Fetch Error:", error);
    }
};