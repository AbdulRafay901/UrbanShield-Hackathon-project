
fetch('components/sidebar.html')
    .then(response => response.text())
    .then(data => {
        const sidebarContainer = document.getElementById("sidebarComponent");
        if (sidebarContainer) {
            sidebarContainer.innerHTML = data;
            initSidebarNavigation();
        }
    })
    .catch(err => console.error("Error loading sidebar component:", err));

// Initialize Sidebar Tab Click Handlers
function initSidebarNavigation() {
    const tabs = document.querySelectorAll('#sidebarComponent .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            
            const pageId = tab.getAttribute('data-page');
            if (pageId && typeof window.switchPage === 'function') {
                window.switchPage(pageId);
            }

            
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('mobile-show')) {
                sidebar.classList.remove('mobile-show');
            }
        });
    });
}


window.initSidebarNavigation = initSidebarNavigation;