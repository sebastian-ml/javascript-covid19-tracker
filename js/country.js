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
                const liElem = createElement('li', 'list-stripped__item');
                liElem.dataset.countryCode = country['country_code'].toLowerCase();
                liElem.innerText = country['country_name'];
                countriesContainer.appendChild(liElem);
            })
        })
}

const countryListContainer = document.getElementById('country-list');
createCountryList(countryListContainer);
