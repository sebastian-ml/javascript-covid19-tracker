google.charts.load("current", { packages: ["corechart"] });

const casesRecord = document.getElementById("daily-cases-record");
const deathRecord = document.getElementById("death-rate-record");
const recoveryRecord = document.getElementById("most-recovered-record");
const newConfirmed = document.getElementById("new_confirmed_important");

const covidStatsURL = "https://corona-api.com/timeline";
const covidData = getAndUpdateCurrentData("covidCasesWorld", covidStatsURL);

covidData.then((covidData) => {
  sessionStorage.setItem("covidCasesWorld", JSON.stringify(covidData));
  const covidRecords = findCovidRecords(covidData);

  runUpdates(
    covidRecords,
    covidData,
    newConfirmed,
    casesRecord,
    deathRecord,
    recoveryRecord
  );
});

function getAndUpdateCurrentData(localStorageKey, url) {
  const isDataInStorage = sessionStorage.getItem(localStorageKey);

  if (!isDataInStorage) {
    return fetchData(url);
  } else {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(isDataInStorage));
    });
  }
}
