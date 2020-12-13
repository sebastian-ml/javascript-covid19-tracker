const url = 'https://cors-anywhere.herokuapp.com/https://corona-api.com/countries';

// Gather all countries code from the given url and store in an array
function fetchCountriesCode(url) {
    return fetch(url)
        .then((response) => response.json())
        .then((jsonResp) => {
            const countriesCode = [];
            (jsonResp.data).forEach((item) => countriesCode.push(item.code))

            return countriesCode;
        })
}

// Check if countries codes in local storage should be updated
function checkForCountryUpdate(url) {
    if(typeof(Storage) !== void(0)) {
        let timeSinceLastUpdate;
        const countriesCode = JSON.parse(localStorage.getItem('countriesCode'));

        if (countriesCode) timeSinceLastUpdate = new Date()
            - new Date(countriesCode['last_update']);

        if (!countriesCode || (timeSinceLastUpdate >= 1000 * 60 * 60 * 24)) {
            const countriesCode = fetchCountriesCode(url);

            // Save countries code in localStorage
            countriesCode
                .then(countriesCodeArray => {
                    const data = {
                        last_update: new Date(),
                        code: countriesCodeArray
                    }
                    localStorage.setItem('countriesCode', JSON.stringify(data));
                })
        }
    }
}

checkForCountryUpdate(url);