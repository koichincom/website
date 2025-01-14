document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".page-links a");
    const currentPath = window.location.pathname.split('/')[1];

    links.forEach(link => {
        const linkPath = link.getAttribute("href").split('/')[1];
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
    });
});