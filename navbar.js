// Fetch Navbar HTML and inject it into the page
function loadNavbar() {
    const navbarElement = document.getElementById('navbar');
    if (navbarElement) {
        fetch('/navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarElement.innerHTML = data;
                highlightActiveLink(); // Call the function after navbar is loaded
            })
            .catch(error => console.error('Error loading navbar:', error));
    }
}

// Highlight the active link based on the current page
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Initialize the script
document.addEventListener('DOMContentLoaded', loadNavbar);