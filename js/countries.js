const url = 'https://corona-api.com/countries';

// Gather all countries code from the given url and store in an array
function fetchCountriesCode(url) {
    return fetchData(url)
        .then(covidStats => {
            const countryInfo = [];

            covidStats.forEach((item) => {
                const country = {
                    country_name: item.name,
                    country_code: item.code
                }
                countryInfo.push(country)
            })

            return countryInfo;
        })
}

// Check if countries codes in local storage should be updated
// Update every 24h
function checkForCountryUpdate(url) {
    if(typeof(Storage) !== void(0)) {
        let timeSinceUpdate;
        const countriesCode = JSON.parse(localStorage.getItem('countriesCode'));

        if (countriesCode) timeSinceUpdate = new Date() - new Date(countriesCode['last_update']);

        if (!countriesCode || (timeSinceUpdate >= 1000 * 60 * 60 * 24)) {
            const countriesCode = fetchCountriesCode(url);

            // Save countries code in localStorage
            countriesCode
                .then(countryInfo => {
                    const data = {
                        last_update: new Date(),
                        countries: countryInfo
                    }
                    localStorage.setItem('countriesCode', JSON.stringify(data));
                })
        }
    }
}

checkForCountryUpdate(url);