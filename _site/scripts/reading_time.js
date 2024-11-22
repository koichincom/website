// Function to calculate reading time
const calculateReadingTime = (text, wordsPerMinute = 238) => {
    const words = text.split(/\s+/).length; // Count words
    const minutes = Math.ceil(words / wordsPerMinute); // Calculate reading time in minutes
    return { words, minutes };
};

// Update reading time and word count
document.addEventListener("DOMContentLoaded", () => {
    const content = document.querySelector(".content");
    const readingTimeElement = document.getElementById("reading-time");

    if (content && readingTimeElement) {
        const text = content.textContent || content.innerText;
        const { words, minutes } = calculateReadingTime(text);

        // Display the reading time and word count
        readingTimeElement.textContent = `${minutes} min read (${words} words)`;
    }
});