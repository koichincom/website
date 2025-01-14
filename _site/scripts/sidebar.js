document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    menuToggle.addEventListener("click", function () {
        const isHidden = sidebar.getAttribute("aria-hidden") === "true";
        sidebar.setAttribute("aria-hidden", !isHidden);
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", function () {
        sidebar.classList.remove("open");
        sidebar.setAttribute("aria-hidden", "true");
        overlay.classList.remove("active");
    });
});