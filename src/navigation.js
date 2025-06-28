/**
 * Navigation Menu Controller
 * Handles mobile menu toggle functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuContent = document.querySelector('.mobile-menu__content');
    
    // Early return if required elements don't exist
    if (!menuToggle || !mobileMenu || !menuContent) {
        console.warn('Navigation: Required elements not found');
        return;
    }
    
    const menuIcon = menuToggle.querySelector('i');

    // Toggle menu when hamburger button is clicked
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open');
        
        // Toggle hamburger icon
        if (menuIcon) {
            if (isOpen) {
                menuIcon.classList.replace('fa-xmark', 'fa-grip-lines');
            } else {
                menuIcon.classList.replace('fa-grip-lines', 'fa-xmark');
            }
        }
    });

    // Close menu when clicking outside of menu content
    mobileMenu.addEventListener('click', (e) => {
        if (!menuContent.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // Close menu when clicking on menu links
    const menuLinks = menuContent.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    /**
     * Close the mobile menu and reset icon
     */
    function closeMenu() {
        mobileMenu.classList.remove('open');
        if (menuIcon) {
            menuIcon.classList.replace('fa-xmark', 'fa-grip-lines');
        }
    }
});