// Function to calculate the number of days between two dates
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : new Date().getTime();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
};

// Update project status and days dynamically
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".project-status").forEach((entry) => {
        const startDate = entry.getAttribute("data-start-date");
        const endDate = entry.getAttribute("data-end-date");

        const statusElement = entry.querySelector(".status");
        const daysElement = entry.querySelector(".days");

        if (startDate) {
            if (endDate) {
                // Completed project
                statusElement.textContent = "Completed";
                daysElement.textContent = `${calculateDays(startDate, endDate)} days`;
            } else {
                // Ongoing project
                statusElement.textContent = "Ongoing";
                daysElement.textContent = `${calculateDays(startDate)} days`;
            }
        } else {
            // Unknown status
            statusElement.textContent = "Unknown";
            daysElement.textContent = "N/A";
        }
    });
});