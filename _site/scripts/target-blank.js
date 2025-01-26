document.addEventListener("DOMContentLoaded", function() {
const links = document.querySelectorAll('a[href^="http"]:not([target="_blank"])');
links.forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
    link.setAttribute("target", "_blank");
    }
});
});