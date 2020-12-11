const url = 'https://cors-anywhere.herokuapp.com/https://corona-api.com/countries';

function checkForCountryUpdate() {
    let timeSinceLastUpdate;
    const countriesCode = JSON.parse(localStorage.getItem('countriesCode'));
    if (countriesCode) timeSinceLastUpdate = new Date()
        - new Date(countriesCode['last_update']);

    if (!countriesCode || (timeSinceLastUpdate >= 1000 * 60 * 60 * 24)) {
        let countryArray;
        const countriesCode = [];

        // Gather all countries code and store in an array
        fetch(url)
            .then((response) => response.json())
            .then((jsonResp) => {
                countryArray = jsonResp.data
                countryArray.forEach((item) => countriesCode.push(item.code))
                const data = {
                    last_update: new Date(),
                    code: countriesCode
                }
                localStorage.setItem('countriesCode', JSON.stringify(data));
            })
    }
}

checkForCountryUpdate();