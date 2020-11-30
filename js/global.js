const hamburgerBtn = document.getElementsByClassName('hamburger')[0];
const hamburgerItem = hamburgerBtn.getElementsByClassName('hamburger__inactive')[0];
const mobileMenuList = document.getElementsByClassName('nav-mobile')[0]
    .getElementsByClassName('vertical-list')[0];

// Add or delete classes when user clicks the menu button
const showMobileMenu = () => {
    mobileMenuList.classList.toggle('vertical-list--active');
    hamburgerItem.classList.toggle('hamburger__inactive');
    hamburgerItem.classList.toggle('hamburger__active');
}

hamburgerBtn.addEventListener('click', showMobileMenu);