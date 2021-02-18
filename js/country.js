// Get a list with all countries
function getAllCountries(url) {
    // Check if country array is in localstorage
    const areCountriesInLocal =
        JSON.parse(localStorage.getItem('countriesCode')).countries;

    if (areCountriesInLocal === true) {
        return new Promise((resolve, rejection) => {
            resolve(areCountriesInLocal);
        });
    } else {
        return fetchCountriesCode(url);
    }
}

// Fill datalist with countries
function createOptions(countryArray, countryContainer) {
    countryArray.then(countries => countries.forEach(country => {
        const optionElem = createHtmlElement(
            'option',
            undefined,
            undefined,
            country.country_name,
            ['country-code', country.country_code.toLowerCase()]
        );

        countryContainer.appendChild(optionElem);
    }))

    return countryContainer;
}

const countryDatalist = document.getElementById('all-countries');
const countriesNames = getAllCountries(url);
createOptions(countriesNames, countryDatalist);

const countryInput = document.getElementById('all-countries-list');

countryInput.addEventListener('change', (e) => {
    const chosenCountryHTML =
        document.querySelector(`option[value="${e.target.value}"]`);
    const countryCode = chosenCountryHTML.dataset.countryCode;
    const countryURL = 'https://corona-api.com/countries/'
        + countryCode;

    fetchData(countryURL)
        .then(data => {
            drawLineChart(
                (data['timeline'].map(day => day['date'])).slice(1),
                (data['timeline'].map(day => day['new_confirmed'])).slice(1),
                'line-chart'
            );
            google.charts.setOnLoadCallback(() => {
                drawPieChart(
                    data['timeline'][0]['active'],
                    data['timeline'][0]['recovered'],
                    data['timeline'][0]['deaths'],
                )
            });
            updateCovidDetails(data['timeline'][0]);
        });
});
