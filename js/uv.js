
import { WEATHER_API_KEY } from "../config.js";
import { uvTips } from "../js/safetyTips.js";
import { updateUvScore } from "../components/sidebar.js";

// DOM Elements Selection
const uvValueElem = document.querySelector(".uv-value"); 
const uvStatusElem = document.querySelector(".uv-status"); 
const uvAdviceElem = document.querySelector(".uv-advice"); 
const uvCircle = document.querySelector(".uv-circle");
const uvCard = document.querySelector(".UV-card");

// Mini Alert Box Elements
const uvAlertIcon = document.querySelector("#uvAlertIcon");
const uvAlertTitle = document.querySelector("#uvAlertTitle");
const uvAlertDesc = document.querySelector("#uvAlertDesc");

export const fetchUvData = async (lat, lon) => {
    try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        const uvIndex = Math.round(data.current.uv_index); 

        let statusText = "";
        let adviceText = ""; 
        let miniTip = "";    
        let iconClass = "";
        let level = 1;

        if (uvIndex <= 2) {
            statusText = "Low";
            adviceText = "Low UV. Safe to enjoy outdoors";
            miniTip = "No protection needed";
            iconClass = "ri-sun-line";
            level = 1;
        } 
        else if (uvIndex <= 5) {
            statusText = "Moderate";
            adviceText = "Wear sunglasses and SPF 30+ sunscreen";
            miniTip = "Wear sunscreen & shades";
            iconClass = "ri-sun-cloudy-line";
            level = 2;
        } 
        else if (uvIndex <= 7) {
            statusText = "High";
            adviceText = "High UV. Apply sunscreen, wear hat"; 
            miniTip = "Use SPF 30+ & wear hat";
            iconClass = "ri-sun-fill";
            level = 3;
        } 
        else if (uvIndex <= 10) {
            statusText = "Very High";
            adviceText = "Very high UV. Avoid direct sun.";
            miniTip = "Avoid direct peak sun";
            iconClass = "ri-alarm-warning-fill";
            level = 4;
        } 
        else {
            statusText = "Extreme";
            adviceText = "Extreme UV! Stay in the shade!";
            miniTip = "Danger! Stay indoors";
            iconClass = "ri-fire-fill";
            level = 5;
        }


        uvTips(uvIndex);
        updateUvScore(uvIndex);


        if (uvValueElem) uvValueElem.textContent = uvIndex;
        if (uvStatusElem) uvStatusElem.textContent = statusText;
        if (uvAdviceElem) uvAdviceElem.textContent = adviceText; 

        if (uvAlertTitle) uvAlertTitle.textContent = `${statusText} UV Alert`;
        if (uvAlertDesc) uvAlertDesc.textContent = miniTip;  
        if (uvAlertIcon) uvAlertIcon.className = `${iconClass} text-danger`;

    } catch (error) {
        console.error("Error fetching UV data:", error);
    }
};

// UV Api -------------------- End