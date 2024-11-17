// Get the current path from the URL
let currentPath = window.location.pathname;

// Simplify the path to its parent directory
// This removes everything after the last slash if the path isn't root
if (currentPath !== "/") {
    currentPath = currentPath.replace(/\/[^/]*$/, "/");
}

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
        break; // Stop the loop once the match is found
    }
}
