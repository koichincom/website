document.getElementById("menu-toggle").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    const isHidden = sidebar.getAttribute("aria-hidden") === "true";
    sidebar.setAttribute("aria-hidden", !isHidden);
    sidebar.classList.toggle("open");
});