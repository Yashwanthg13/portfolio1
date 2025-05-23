// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const html = document.documentElement;
    const themeIcons = document.querySelectorAll('.theme-icon');
    const themeTexts = document.querySelectorAll('.theme-toggle span');

    // Initialize theme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            html.dataset.theme = savedTheme;
        } else if (prefersDark) {
            html.dataset.theme = 'dark';
        } else {
            html.dataset.theme = 'light';
        }
        updateThemeUI();
    }

    // Update UI based on current theme
    function updateThemeUI() {
        const isDark = html.dataset.theme === 'dark';
        
        // Update icons
        themeIcons.forEach(icon => {
            icon.classList.toggle('fa-sun', isDark);
            icon.classList.toggle('fa-moon', !isDark);
        });
        
        // Update text
        themeTexts.forEach(text => {
            if (text) {
                text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            }
        });
    }

    // Toggle theme
    function toggleTheme(e) {
        if (e) e.preventDefault();
        const newTheme = html.dataset.theme === 'dark' ? 'light' : 'dark';
        html.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        updateThemeUI();
    }

    // Add event listeners
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });

    // Listen for system theme changes (only if no preference is set)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            html.dataset.theme = e.matches ? 'dark' : 'light';
            updateThemeUI();
        }
    });

    // Initialize
    initTheme();
});
