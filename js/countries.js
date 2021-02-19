const countryURL = "https://corona-api.com/countries";
const isUpdateRequired = checkForCountryUpdate(24);

if (isUpdateRequired) udpdateCountryData(countryURL);

// Check if update is needed (last update was 'hours' ago)
function checkForCountryUpdate(hours) {
  if (typeof Storage !== void 0) {
    let timeSinceUpdate;
    const countriesCode = JSON.parse(localStorage.getItem("countriesCode"));

    if (countriesCode) {
      timeSinceUpdate = new Date() - new Date(countriesCode.last_update);
    }
    if (!countriesCode || timeSinceUpdate >= 1000 * 60 * 60 * hours) {
      return true;
    }
  }
}

// Update local data if it is required
async function udpdateCountryData(url) {
  const countriesCode = await fetchData(url);
  const data = {
    last_update: new Date(),
    countries: countriesCode,
  };
  localStorage.setItem("countriesCode", JSON.stringify(data));
}
