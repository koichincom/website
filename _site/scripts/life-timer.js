document.addEventListener("DOMContentLoaded", () => {
    const birthDate = new Date(2004, 11, 9); // Birthdate (December 9, 2004)
    const lifespan = 90; // Estimated lifespan in years

    // Calculate the estimated death date
    const deathDate = new Date(birthDate.getTime());
    deathDate.setFullYear(deathDate.getFullYear() + Math.floor(lifespan));
    deathDate.setMonth(deathDate.getMonth() + Math.round((lifespan % 1) * 12));

    // Display lifespan in the HTML
    const lifespanElement = document.getElementById("lifespan");
    if (lifespanElement) {
        lifespanElement.textContent = lifespan;
    }

    // Function to calculate remaining time
    const calculateRemainingTime = () => {
        const now = new Date();
        const remainingTime = deathDate - now;

        // If time is up, return zero values
        if (remainingTime <= 0) {
            return {
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                totalMonths: 0,
                totalWeeks: 0,
                totalDays: 0,
                totalHours: 0,
                totalMinutes: 0,
                totalSeconds: 0,
            };
        }

        // Breakdown of remaining time
        const seconds = Math.floor(remainingTime / 1000) % 60;
        const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
        const hours = Math.floor(remainingTime / (1000 * 60 * 60)) % 24;
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24)) % 30; // Assuming 30 days per month
        const months = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 30)) % 12;
        const years = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 365.25)); // 1 year = 365.25 days

        // Total conversions
        const totalMonths = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 30));
        const totalWeeks = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 7));
        const totalDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(remainingTime / (1000 * 60 * 60));
        const totalMinutes = Math.floor(remainingTime / (1000 * 60));
        const totalSeconds = Math.floor(remainingTime / 1000);

        return {
            years,
            months,
            days,
            hours,
            minutes,
            seconds,
            totalMonths,
            totalWeeks,
            totalDays,
            totalHours,
            totalMinutes,
            totalSeconds,
        };
    };

    // Function to update the display
    const updateDisplay = () => {
        const remaining = calculateRemainingTime();

        // Display "years, months, days, hours, minutes, seconds"
        const remainingTimeElement = document.getElementById("remaining-time");
        if (remainingTimeElement) {
            remainingTimeElement.textContent = `${remaining.years} years, ${remaining.months} months, ${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds`;
        }

        // Display "total months, total weeks, total days, total hours, total minutes, total seconds"
        const remainingConversionsElement = document.getElementById("remaining-time-conversions");
        if (remainingConversionsElement) {
            remainingConversionsElement.textContent = `${remaining.totalMonths} months, ${remaining.totalWeeks} weeks, ${remaining.totalDays} days, ${remaining.totalHours} hours, ${remaining.totalMinutes} minutes, ${remaining.totalSeconds} seconds`;
        }
    };

    // Initial display update
    updateDisplay();

    // Update the display every second
    setInterval(updateDisplay, 1000);
});