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

// Gather covid stats for the current day, update info on the site and draw a chart
function fetchStats(url) {
    return fetch(url)
        .then(response => response.json())
        .then(respJSON => respJSON.data)
}

const drawChart = (covidData, callback) => {
    // Save daily cases and dates into 2 arrays
    const timeline = [];
    const cases = [];
    covidData.forEach(day => {
        timeline.push(day['date']);
        cases.push(day['new_confirmed']);
    })

    // Draw a line chart with daily cases
    callback(timeline, cases);
}

function createElement(htmlTag, htmlClass= undefined, htmlId = undefined) {
    const newElement = document.createElement(htmlTag);
    if (htmlClass) newElement.classList.add(htmlClass);
    if (htmlId) newElement.id = htmlId;

    return newElement;
}