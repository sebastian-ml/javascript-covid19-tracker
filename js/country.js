// Get a list with all countries
function getCountriesFromLocal(url) {
    // Check if country array is in localstorage
    const areCountriesInLocal =
        JSON.parse(localStorage.getItem('countriesCode')).countries;

    if (areCountriesInLocal === true) {
        return new Promise((resolve, rejection) => {
            resolve(areCountriesInLocal);
        });
    } else {
        return fetchData(url);
    }
}

// Fill datalist with countries
async function createOptions(countryContainer, url) {
    const countriesInfo = await getCountriesFromLocal(url);

    countriesInfo.forEach(country => {
        const optionElem = createHtmlElement(
            'option',
            undefined,
            undefined,
            country.name,
            ['country-code', country.code.toLowerCase()]
        );

        countryContainer.appendChild(optionElem);
    })

    return countryContainer;
}

const countryDatalist = document.getElementById('all-countries');
createOptions(countryDatalist, url);

const countryInput = document.getElementById('all-countries-list');

// Show covid data for the selected country
countryInput.addEventListener('change', async (e) => {
    const chosenCountryHTML =
        document.querySelector(`option[value="${e.target.value}"]`);
    const countryCode = chosenCountryHTML.dataset.countryCode;
    const countryURL = 'https://corona-api.com/countries/' + countryCode;

    const countryData = await fetchData(countryURL);
    drawLineChart(
        (countryData['timeline'].map(day => day['date'])).slice(1),
        (countryData['timeline'].map(day => day['new_confirmed'])).slice(1),
        'line-chart'
    );
    google.charts.setOnLoadCallback(() => {
        drawPieChart(
            countryData['timeline'][0]['active'],
            countryData['timeline'][0]['recovered'],
            countryData['timeline'][0]['deaths'],
        )
    });
    updateCovidDetails(countryData['timeline'][0]);
});
