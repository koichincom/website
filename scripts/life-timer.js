document.addEventListener("DOMContentLoaded", () => {
    const birthDate = new Date(2004, 11, 9); // Birthdate (December 9, 2004)
    const lifespan = 90; // Estimated lifespan in years

    // Calculate the estimated death date
    const deathDate = new Date(birthDate.getTime());
    deathDate.setFullYear(deathDate.getFullYear() + Math.floor(lifespan));
    deathDate.setMonth(deathDate.getMonth() + Math.round((lifespan % 1) * 12));

    // Function to calculate remaining time
    const calculateRemainingTime = () => {
        const now = new Date();
        const remainingTime = deathDate - now;

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

        const seconds = Math.floor(remainingTime / 1000) % 60;
        const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
        const hours = Math.floor(remainingTime / (1000 * 60 * 60)) % 24;
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24)) % 30; // assume 30 days per month
        const months = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 30)) % 12;
        const years = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 365.25));

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

        // Major breakdown: Years, Months, Days
        const majorRemainingTimeElement = document.getElementById("major-remaining-time");
        if (majorRemainingTimeElement) {
            majorRemainingTimeElement.innerHTML = `
                <div><strong>${remaining.years}</strong> years</div>
                <div><strong>${remaining.months}</strong> months</div>
                <div><strong>${remaining.days}</strong> days</div>
                <div>${remaining.hours} hours</div>
                <div>${remaining.minutes} minutes</div>
                <div>${remaining.seconds} seconds</div>
            `;
        }

        // Supplementary breakdown: Hours, Minutes, Seconds
        const supplementaryRemainingTimeElement = document.getElementById("supplementary-remaining-time");
        if (supplementaryRemainingTimeElement) {
            supplementaryRemainingTimeElement.innerHTML = `
                <div>${remaining.totalMonths} total months</div>
                <div>${remaining.totalWeeks} total weeks</div>
                <div>${remaining.totalDays} total days</div>
            `;
        }
    };

    // Initial display update
    updateDisplay();

    // Update the display every second
    setInterval(updateDisplay, 1000);
});
