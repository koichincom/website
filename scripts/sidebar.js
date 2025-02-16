document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const header = document.querySelector("nav.header");
    const pageLinks = header.querySelector(".page-links");

    // Toggle sidebar and update icon when clicking the menu toggle
    menuToggle.addEventListener("click", function (e) {
        e.stopPropagation(); // prevent the document click from immediately closing the sidebar
        header.classList.toggle("open");
        updateMenuToggleIcon();
    });

    // Prevent clicks inside page-links from closing the sidebar
    if (pageLinks) {
        pageLinks.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    // Close sidebar when clicking outside of page-links and menu-toggle
    document.addEventListener("click", function (e) {
        if (header.classList.contains("open") &&
            !e.target.closest(".page-links") &&
            !e.target.closest(".social-links") &&
            !e.target.closest("#menu-toggle")) {
            header.classList.remove("open");
            updateMenuToggleIcon();
        }
    });

    function updateMenuToggleIcon() {
        if (header.classList.contains("open")) {
            menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    }
});
