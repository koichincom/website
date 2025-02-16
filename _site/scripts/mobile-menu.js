const menuToggle = document.querySelector('.header__menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuContent = document.querySelector('.mobile-menu__content');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

mobileMenu.addEventListener('click', (e) => {
    if (!menuContent.contains(e.target)) {
        mobileMenu.classList.remove('open');
    }
});