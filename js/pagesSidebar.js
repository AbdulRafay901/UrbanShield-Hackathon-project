const sidebarload = async () => {

  const res = await fetch('../components/sidebar.html')

  const data = await res.text()
    
        const sidebarContainer = document.getElementById("sidebarComponent");
        if (sidebarContainer) {
            sidebarContainer.innerHTML = data;
            
            const logoImg = sidebarContainer.querySelector('.logo-text img');
                        if (logoImg && !logoImg.src.includes('../assets/')) {
                            logoImg.src = '../assets/logo.png';
                        }            

            loadSidebar()
        }    
}

sidebarload()

  export function loadSidebar(){
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