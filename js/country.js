// Get a list with all countries
function getCountriesFromLocal(url) {
  const areCountriesInLocal = JSON.parse(localStorage.getItem("countriesCode"));

  if (areCountriesInLocal === true) {
    return new Promise((resolve, rejection) => {
      resolve(areCountriesInLocal.countries);
    });
  } else {
    return fetchData(url);
  }
}

// Fill datalist with countries
async function createOptions(countryContainer, url) {
  const countriesInfo = await getCountriesFromLocal(url);

  countriesInfo.forEach((country) => {
    const optionElem = createHtmlElement(
      "option",
      undefined,
      undefined,
      country.name,
      ["country-code", country.code.toLowerCase()]
    );

    countryContainer.appendChild(optionElem);
  });
}

const countryDatalist = document.getElementById("all-countries");
createOptions(countryDatalist, countryURL);

const countryInput = document.getElementById("all-countries-list");

// Show covid data for the selected country
countryInput.addEventListener("change", async (e) => {
  const chosenCountryHTML = document.querySelector(
    `option[value="${e.target.value}"]`
  );
  const countryCode = chosenCountryHTML.dataset.countryCode;
  const countryURL = "https://corona-api.com/countries/" + countryCode;

  const casesRecord = document.getElementById("daily-cases-record");
  const deathRecord = document.getElementById("death-rate-record");
  const recoveryRecord = document.getElementById("most-recovered-record");
  const newConfirmed = document.getElementById("new_confirmed_important");

  const countryData = await fetchData(countryURL);
  const countryTimeline = countryData.timeline;

  const records = findCovidRecords(countryTimeline);

  runUpdates(
    records,
    countryTimeline,
    newConfirmed,
    casesRecord,
    deathRecord,
    recoveryRecord
  );
});

const countryInputLabel = document.getElementById("all-countries-list-label");
countryInputLabel.addEventListener("click", () => {
  e.preventDefault();
});

// Delete current value country if the user clicks the datalist
countryInput.addEventListener("click", function () {
  if (this.value.length > 0) {
    this.value = "";
  }
});
