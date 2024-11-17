// Get the current path from the URL
const currentPath = window.location.pathname;

// Map links to their corresponding paths
const navLinks = {
    "/": "home-link",
    "/blog/": "blog-link",
    "/about/": "about-link",
    "/project/": "project-link",
};

// Remove 'active' class from all links first
document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
});

// Find the matching link and add the "active" class
for (const [path, linkId] of Object.entries(navLinks)) {
    if (currentPath === path) {
        document.getElementById(linkId)?.classList.add("active");
    }
}
