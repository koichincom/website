document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const header = document.querySelector("nav.header");

    menuToggle.addEventListener("click", function () {
        header.classList.toggle("open");
    });
});