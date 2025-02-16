// Hide header on scroll down, show on scroll up

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    let lastScrollY = window.scrollY;
    const hideThreshold = 50;

    window.addEventListener("scroll", () => {
        if (header.classList.contains("open")) return;
        if (window.scrollY > lastScrollY && window.scrollY > hideThreshold) {
            header.classList.add("hide");
        } else if (window.scrollY < lastScrollY) {
            header.classList.remove("hide");
        }
        lastScrollY = window.scrollY;
    });
});