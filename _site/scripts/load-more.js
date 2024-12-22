document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 10;
    const postsPerPage = 10;
    const blogList = document.getElementById("blog-list");
    const loadingMessage = document.getElementById("loading-message");
    let isLoading = false;
    let totalPosts = 0;
    let lastScrollPosition = 0;

    // Get total posts from data.json
    async function fetchTotalPosts() {
        try {
            const response = await fetch("/blog/data.json");
            const posts = await response.json();
            totalPosts = posts.length;
            console.log(`Total posts: ${totalPosts}`);
        } catch (error) {
            console.error("Failed to fetch total posts:", error);
        }
    }

    fetchTotalPosts();

    window.addEventListener("scroll", () => {
        const currentScrollPosition = window.scrollY;

        if (
            !isLoading &&
            currentScrollPosition > lastScrollPosition &&
            window.innerHeight + currentScrollPosition >= document.body.offsetHeight - 100
        ) {
            loadMorePosts();
        }

        lastScrollPosition = currentScrollPosition;
    });

    // Load more posts
    async function loadMorePosts() {
        console.log("loadMorePosts called");

        if (isLoading) {
            console.log("Currently loading, skipping...");
            return;
        }

        isLoading = true;
        loadingMessage.style.display = "block";

        try {
            const response = await fetch("/blog/data.json");
            const posts = await response.json();

            // 次の投稿を取得
            const nextPosts = posts.slice(currentIndex, currentIndex + postsPerPage);
            nextPosts.forEach(post => {
                console.log(`Appending post: ${post.title}`);
                const postElement = document.createElement("div");
                postElement.classList.add("text-entry");
                postElement.innerHTML = `
                    <h1><a href="${post.url}">${post.title}</a></h1>
                    <p class="date">${post.date}</p>
                    <div class="content">${post.excerpt}</div>
                `;
                blogList.appendChild(postElement);
            });

            currentIndex += postsPerPage;

            if (currentIndex >= totalPosts) {
                console.log("All posts loaded");
                window.removeEventListener("scroll", loadMorePosts);
                loadingMessage.style.display = "none";
                return;
            }

            console.log("Load more posts completed");
        } catch (error) {
            console.error("Failed to load more posts:", error);
        } finally {
            isLoading = false;
            loadingMessage.style.display = "none";
        }
    }
});
