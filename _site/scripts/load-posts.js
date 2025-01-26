document.addEventListener("DOMContentLoaded", () => {
    const loadMoreButton = document.getElementById("load-more");
    const hiddenPostsContainer = document.querySelector(".post-list-hidden");
    const postListContainer = document.querySelector(".post-list");

    if (!hiddenPostsContainer) {
        console.log("No hidden posts container found.");
        return;
    }

    if (!loadMoreButton) {
        console.log("Load More button not found.");
        return;
    }

    const posts = hiddenPostsContainer.querySelectorAll(".post");
    let visibleCount = 0;
    const postsPerPage = 10;

    loadMoreButton.addEventListener("click", () => {
        const nextPosts = Array.from(posts).slice(visibleCount, visibleCount + postsPerPage);
        nextPosts.forEach(post => postListContainer.appendChild(post));
        visibleCount += postsPerPage;

        if (visibleCount >= posts.length) {
            loadMoreButton.style.display = "none";
        }
    });
});