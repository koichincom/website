// Function to calculate the number of days between two dates
const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : new Date().getTime();
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".project-status").forEach((entry) => {
        const startDate = entry.getAttribute("data-start-date");
        const endDate = entry.getAttribute("data-end-date");

        const statusElement = entry.querySelector(".status");
        const daysElement = entry.querySelector(".days");

        if (startDate) {
            if (endDate) {
                statusElement.textContent = "Completed";
                statusElement.classList.add("status-completed");
                daysElement.textContent = `${calculateDays(startDate, endDate)} days`;
            } else {
                statusElement.textContent = "Ongoing";
                statusElement.classList.add("status-ongoing");
                daysElement.textContent = `${calculateDays(startDate)} days`;
            }
        } else {
            statusElement.textContent = "Unknown";
            statusElement.classList.add("status-unknown");
            daysElement.textContent = "N/A";
        }
    });
});