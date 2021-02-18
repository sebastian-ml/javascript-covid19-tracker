// Get a list with all countries
function getAllCountries(url) {
    // Check if country array is in localstorage
    const areCountriesInLocal
        = JSON.parse(localStorage.getItem('countriesCode')).countries;

    if (areCountriesInLocal === true) {
        return new Promise((resolve, rejection) => {
            resolve(areCountriesInLocal);
        })
    } else {
        return fetchCountriesCode(url);
    }
}

function createOptions(countryArray, countryContainer) {
    countryArray.then(countries => countries.forEach(country => {
        const optionElem = createHtmlElement('option');

        optionElem.value = country.country_name;
        optionElem.dataset.countryCode = country.country_code.toLowerCase();

        countryContainer.appendChild(optionElem);
    }))

    return countryContainer;
}

const countryDatalist = document.getElementById('all-countries');
const countriesNames = getAllCountries(url);
createOptions(countriesNames, countryDatalist);

const countryInput = document.getElementById('all-countries-list');
countryInput.addEventListener('change', (e) => {
    const countryUrl = 'https://corona-api.com/countries/'
        + countryCode;

    fetchSomeData(countryUrl)
        .then(data => {
            drawLineChart(
                (data['timeline'].map(day => day['date'])).slice(1),
                (data['timeline'].map(day => day['new_confirmed'])).slice(1),
                'line-chart'
            );
            google.charts.setOnLoadCallback(() => drawPieChart(
                data['timeline'][0]['active'],
                data['timeline'][0]['recovered'],
                data['timeline'][0]['deaths'],
            ))
            updateCovidDetails(data['timeline'][0]);
        });
})

