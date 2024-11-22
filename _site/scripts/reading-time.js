document.addEventListener("DOMContentLoaded", () => {
    // Function to calculate reading time
    const calculateReadingTime = (text, wordsPerMinute = 238) => {
        const words = text.split(/\s+/).length; // Count words
        const minutes = Math.ceil(words / wordsPerMinute); // Calculate reading time in minutes
        return { minutes };
    };

    // Find the content and reading-time element
    const content = document.querySelector(".content");
    const readingTimeElement = document.getElementById("reading-time");

    if (content && readingTimeElement) {
        const text = content.textContent || content.innerText;
        const { minutes } = calculateReadingTime(text);

        // Display the reading time
        readingTimeElement.textContent = `${minutes} min read`;
    }
});