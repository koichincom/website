document.addEventListener("DOMContentLoaded", () => {
    const loadMoreButton = document.getElementById("load-more");
    const hiddenPostsContainer = document.querySelector(".post-list-hidden");
    const postListContainer = document.querySelector(".post-list");
    const posts = hiddenPostsContainer.querySelectorAll(".post");
    let visibleCount = 0;
    const postsPerPage = 10;

    loadMoreButton.addEventListener("click", () => {
        // Load the next set of posts
        const nextPosts = Array.from(posts).slice(visibleCount, visibleCount + postsPerPage);
        nextPosts.forEach(post => postListContainer.appendChild(post));
        visibleCount += postsPerPage;

        // Hide Load More button if all posts are displayed
        if (visibleCount >= posts.length) {
            loadMoreButton.style.display = "none";
        }
    });
});