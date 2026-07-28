// Emergency Page Logic - UrbanShield

const STORAGE_KEY = "urban_emergency_checklist";

window.addEventListener("DOMContentLoaded", () => {
    initChecklist();
    initShareLocation();
});

// Checklist State Persistence
function initChecklist() {
    const items = document.querySelectorAll(".checklist-item");
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    items.forEach((item, index) => {
        const itemId = item.getAttribute("data-id") || `item_${index}`;

        // Restore saved state
        if (savedState[itemId]) {
            item.classList.add("checked");
        }

        // Toggle click handler
        item.addEventListener("click", () => {
            item.classList.toggle("checked");

            // Update storage
            const updatedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            updatedState[itemId] = item.classList.contains("checked");
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        });
    });
}

// SOS Location Sharing
function initShareLocation() {
    const btn = document.getElementById("btnShareLocation");
    if (!btn) return;

    btn.addEventListener("click", () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Getting location...`;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                const shareText = `EMERGENCY ALERT: I am at Location: ${mapsUrl}`;

                btn.innerHTML = originalText;

                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Emergency Location - UrbanShield',
                            text: shareText,
                            url: mapsUrl
                        });
                    } catch (err) {
                        console.log("Share cancelled or failed:", err);
                        copyToClipboard(mapsUrl);
                    }
                } else {
                    copyToClipboard(mapsUrl);
                }
            },
            (err) => {
                btn.innerHTML = originalText;
                alert("Failed to access your location. Please check location permissions.");
                console.error("Location error:", err);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("🚨 Emergency Location link copied to clipboard!\n" + text);
    }).catch(err => {
        alert("Emergency Location: " + text);
    });
}
