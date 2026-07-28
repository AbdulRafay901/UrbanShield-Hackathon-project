// Analytics Page Charts Logic - UrbanShield

let tempChartInstance = null;
let aqiChartInstance = null;

// Mock 7-day data
const data7Days = {
    labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    temp: [32, 31, 29, 28, 30, 31, 32],
    aqi: [40, 55, 50, 45, 50, 52, 48]
};

// Mock 30-day data
const data30Days = {
    labels: Array.from({ length: 15 }, (_, i) => `Day ${i * 2 + 1}`),
    temp: [30, 32, 31, 29, 28, 27, 29, 30, 31, 33, 32, 30, 29, 31, 30],
    aqi: [42, 48, 55, 60, 52, 45, 40, 44, 50, 58, 54, 49, 46, 51, 47]
};

window.addEventListener("DOMContentLoaded", () => {
    initCharts(data7Days);

    const filterSelect = document.getElementById("analyticsFilter");
    if (filterSelect) {
        filterSelect.addEventListener("change", (e) => {
            const val = e.target.value;
            if (val === "30") {
                updateCharts(data30Days);
            } else {
                updateCharts(data7Days);
            }
        });
    }
});

function initCharts(dataset) {
    const tempCtx = document.getElementById('tempLineChart')?.getContext('2d');
    const aqiCtx = document.getElementById('aqiBarChart')?.getContext('2d');

    if (!tempCtx || !aqiCtx || typeof Chart === 'undefined') return;

    // 1. Temperature Line Chart Gradient
    const tempGrad = tempCtx.createLinearGradient(0, 0, 0, 220);
    tempGrad.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
    tempGrad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    tempChartInstance = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: dataset.labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: dataset.temp,
                borderColor: '#2563EB',
                borderWidth: 3,
                backgroundColor: tempGrad,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2563EB',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y}°C`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9BA8C8', font: { family: 'Inter', size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#9BA8C8',
                        font: { family: 'Inter', size: 11 },
                        callback: (val) => `${val}°`
                    }
                }
            }
        }
    });

    // 2. Air Quality Bar Chart Gradient
    const aqiGrad = aqiCtx.createLinearGradient(0, 0, 0, 220);
    aqiGrad.addColorStop(0, '#10B981');
    aqiGrad.addColorStop(1, '#059669');

    aqiChartInstance = new Chart(aqiCtx, {
        type: 'bar',
        data: {
            labels: dataset.labels,
            datasets: [{
                label: 'Air Quality (AQI)',
                data: dataset.aqi,
                backgroundColor: aqiGrad,
                borderRadius: 8,
                barThickness: dataset.labels.length > 10 ? 12 : 22
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `AQI: ${ctx.parsed.y}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#9BA8C8', font: { family: 'Inter', size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9BA8C8', font: { family: 'Inter', size: 11 } }
                }
            }
        }
    });
}

function updateCharts(dataset) {
    if (tempChartInstance) {
        tempChartInstance.data.labels = dataset.labels;
        tempChartInstance.data.datasets[0].data = dataset.temp;
        tempChartInstance.update();
    }

    if (aqiChartInstance) {
        aqiChartInstance.data.labels = dataset.labels;
        aqiChartInstance.data.datasets[0].data = dataset.aqi;
        aqiChartInstance.data.datasets[0].barThickness = dataset.labels.length > 10 ? 12 : 22;
        aqiChartInstance.update();
    }
}
