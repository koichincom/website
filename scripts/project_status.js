// Function to calculate the number of days between two dates
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : new Date().getTime();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
};

// Iterate over each project entry
document.querySelectorAll(".text-entry").forEach((entry) => {
    const startDate = entry.getAttribute("data-start-date");
    const endDate = entry.getAttribute("data-end-date");

    // Elements for status and days
    const statusElement = entry.querySelector(".status");
    const daysElement = entry.querySelector(".days");

    if (startDate) {
        if (endDate) {
            // Completed project
            statusElement.textContent = "Completed";
            daysElement.textContent = `Days Taken: ${calculateDays(startDate, endDate)} days`;
        } else {
            // Ongoing project
            statusElement.textContent = "Ongoing";
            daysElement.textContent = `Days Ongoing: ${calculateDays(startDate)} days`;
        }
    } else {
        // If no start date is provided, fallback
        statusElement.textContent = "Status: Unknown";
        daysElement.textContent = "";
    }
});
