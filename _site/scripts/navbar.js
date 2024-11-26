let currentPath = window.location.pathname;

if (currentPath.startsWith("/blog/") && currentPath !== "/blog/") {
    currentPath = "/blog/";
} else if (currentPath.startsWith("/project/") && currentPath !== "/project/") {
    currentPath = "/project/";
}

document.querySelectorAll(".nav-link").forEach(link => {
    const linkPath = link.getAttribute("href");

    if (currentPath === linkPath) {
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }
});


