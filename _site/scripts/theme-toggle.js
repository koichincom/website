const themeToggleButton = document.getElementById('theme-toggle');

// The themeToggleButton is a button element with the id of 'theme-toggle'.
themeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
});

// The dark mode is enabled if the 'dark-mode' class is present in the body element.
window.addEventListener('load', () => {
    const darkMode = localStorage.getItem('darkMode');

    if (darkMode) {
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
        }
    } else {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }
});