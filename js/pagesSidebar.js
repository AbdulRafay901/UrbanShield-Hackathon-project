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

                        const tabs = sidebarContainer.querySelectorAll('.tab');
                        tabs.forEach(tab => {
                            tab.classList.remove('tab-active');
                            tab.addEventListener("click", ((e) => {
                                e.target.classList.add('tab-active')
                            }))
                        });

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