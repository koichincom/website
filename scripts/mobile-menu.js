const menuToggle = document.querySelector('.header__menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuContent = document.querySelector('.mobile-menu__content');
const menuIcon = menuToggle.querySelector('i'); // Select the icon inside menuToggle

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');

    // Toggle the icon class
    if (mobileMenu.classList.contains('open')) {
        menuIcon.classList.replace('fa-grip-lines', 'fa-xmark');
    } else {
        menuIcon.classList.replace('fa-xmark', 'fa-grip-lines');
    }
});

mobileMenu.addEventListener('click', (e) => {
    if (!menuContent.contains(e.target)) {
        mobileMenu.classList.remove('open');
        menuIcon.classList.replace('fa-x', 'fa-bars'); // Reset icon when menu closes
    }
});