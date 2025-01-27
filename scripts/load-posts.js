document.addEventListener("DOMContentLoaded", function () {
    const posts = Array.from(document.querySelectorAll(".post-card"));
    const loadMoreButton = document.getElementById("load-more");

    let visibleCount = 30;
    const LOAD_COUNT = 30;

    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", function () {
            const startIndex = visibleCount;
            const endIndex = visibleCount + LOAD_COUNT;

            for (let i = startIndex; i < endIndex && i < posts.length; i++) {
                posts[i].classList.remove("hidden");
            }

            visibleCount += LOAD_COUNT;

            if (visibleCount >= posts.length) {
                loadMoreButton.style.display = "none";
            }
        });
    }
});