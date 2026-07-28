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

            
        }    
}

sidebarload()

