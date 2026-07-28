// Settings elements selection
const tempUnitSelect = document.getElementById("tempUnitSelect");
const windUnitSelect = document.getElementById("windUnitSelect");
const darkModeToggle = document.getElementById("darkModeToggle");
const notificationsToggle = document.getElementById("notificationsToggle");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const aboutModalBtn = document.getElementById("aboutModalBtn");

// Bootstrap Toast Helper
function showToast(message) {
    const toastEl = document.getElementById('settingsToast');
    const toastMsg = document.getElementById('toastMessage');
    if (toastEl && toastMsg) {
        toastMsg.textContent = message;
        const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
        toast.show();
    }
}

// 1. Load Saved Settings from LocalStorage
function loadSettings() {
    const tempUnit = localStorage.getItem("tempUnit") || "metric";
    const windUnit = localStorage.getItem("windUnit") || "kmh";
    const darkMode = localStorage.getItem("darkMode") !== "false";
    const notifications = localStorage.getItem("notifications") !== "false";

    if (tempUnitSelect) tempUnitSelect.value = tempUnit;
    if (windUnitSelect) windUnitSelect.value = windUnit;
    if (darkModeToggle) darkModeToggle.checked = darkMode;
    if (notificationsToggle) notificationsToggle.checked = notifications;
}

// 2. Event Listeners for Live Preferences Saving
window.addEventListener("DOMContentLoaded", () => {
    loadSettings();

    // Temperature Unit Change
    tempUnitSelect?.addEventListener("change", (e) => {
        localStorage.setItem("tempUnit", e.target.value);
        showToast(`Temperature unit updated to ${e.target.value === 'metric' ? '°C' : '°F'}`);
    });

    // Wind Speed Unit Change
    windUnitSelect?.addEventListener("change", (e) => {
        localStorage.setItem("windUnit", e.target.value);
        showToast(`Wind speed unit updated to ${e.target.value}`);
    });

    // Dark Mode Toggle Switch
    darkModeToggle?.addEventListener("change", (e) => {
        localStorage.setItem("darkMode", e.target.checked);
        showToast(`Dark Mode ${e.target.checked ? 'Enabled' : 'Disabled'}`);
    });

    // Notifications Toggle Switch
    notificationsToggle?.addEventListener("change", (e) => {
        localStorage.setItem("notifications", e.target.checked);
        showToast(`Notifications ${e.target.checked ? 'Enabled' : 'Disabled'}`);
    });

    // Clear Search History Action
    clearHistoryBtn?.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your search history?")) {
            localStorage.removeItem("searchHistory");
            localStorage.removeItem("recentLocations");
            showToast("Search history cleared successfully.");
        }
    });

    // About UrbanShield Modal/Alert Action
    aboutModalBtn?.addEventListener("click", () => {
        alert("UrbanShield v1.0.0\nSmart City Safety & Environmental Monitoring Dashboard.\nBuilt for real-time alerts, AQI, UV, and weather tracking.");
    });
});