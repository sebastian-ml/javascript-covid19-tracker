const url = 'https://cors-anywhere.herokuapp.com/https://corona-api.com/countries';
let countryArray;
const countriesCode = [];

// Gather all countries code and store in an array
fetch(url)
    .then((response) => response.json())
    .then((jsonResp) => countryArray = jsonResp.data)
    .then(() => countryArray.forEach((item) => countriesCode.push(item.code)))

