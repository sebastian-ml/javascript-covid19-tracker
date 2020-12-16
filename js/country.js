let countriesList;
/**
 * Create a list with countries
 *
 * @param countriesContainer - html element to wrap all countries. Must be a DOM element
 */
function createCountryList(countriesContainer) {
    const url = 'https://cors-anywhere.herokuapp.com/https://corona-api.com/countries';
    let countries;

    // Check if there is a list in localStorage with countries
    if (JSON.parse(localStorage.getItem('countriesCode'))) {
        countries = new Promise((resolve, rejection) => {
            resolve(JSON.parse(localStorage.getItem('countriesCode'))['countries']);
        })
    } else {
        countries = fetchCountriesCode(url);
    }

    // Create list element for each country and append to container
    countries
        .then(countries => {
            countries.forEach(country => {
                const liElem = createHtmlElement('li', 'list-stripped__item');
                liElem.dataset.countryCode = country['country_code'].toLowerCase();
                liElem.innerText = country['country_name'];
                countriesContainer.appendChild(liElem);
            })
            countriesList = document.getElementsByClassName('list-stripped__item');
        })
}

const countryListContainer = document.getElementById('country-list');
createCountryList(countryListContainer);

countryListContainer.addEventListener('click', (e) => {
    const countryCode = e.target.dataset.countryCode;
    const url = 'https://cors-anywhere.herokuapp.com/https://corona-api.com/countries/'
        + countryCode;

    fetchSomeData(url)
        .then(data => {
            drawLineChart(
                (data.map(day => day['date'])).slice(1),
                (data.map(day => day['new_confirmed'])).slice(1),
                'line-chart'
            );
        });
})

const searchCountry = document.getElementById('search-country');
searchCountry.addEventListener('keypress', (e) => {
    if (countriesList.length < 1) return;
    const pressedKey = e.target.value.toLowerCase();

    Array.from(countriesList).forEach(country => country.style.display = '');
    Array.from(countriesList).forEach(country => {
        if (!country.innerText.toLowerCase()
            .includes(pressedKey)) country.style.display = 'none';
    })
})
