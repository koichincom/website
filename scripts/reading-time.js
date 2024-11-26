document.addEventListener("DOMContentLoaded", () => {
    const wordsPerMinute = 238;

    // Function to calculate reading time
    const calculateReadingTime = (text) => {
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    // Handle single post page
    const singlePostReadingTime = document.querySelector(".reading-time-single");
    if (singlePostReadingTime) {
        const content = document.querySelector(".content");
        if (content) {
            const text = content.textContent || content.innerText;
            const minutes = calculateReadingTime(text);
            singlePostReadingTime.textContent = `${minutes} min read`;
        }
    }

    // Handle blog list page
    const blogListReadingTimes = document.querySelectorAll(".reading-time");
    blogListReadingTimes.forEach(async (element) => {
        const postUrl = element.getAttribute("data-url");
        if (postUrl) {
            try {
                const response = await fetch(postUrl);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const content = doc.querySelector(".content");

                if (content) {
                    const text = content.textContent || content.innerText;
                    const minutes = calculateReadingTime(text);
                    element.textContent = `${minutes} min read`;
                }
            } catch (error) {
                console.error(`Error fetching post content from ${postUrl}:`, error);
                element.textContent = "Error";
            }
        }
    });
});