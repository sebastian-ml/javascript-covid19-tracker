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
  runUpdates(covidRecords, covidData);
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

function findCovidRecords(dataset) {
  return {
    cases: dataset.reduce((acc, curr) => {
      return curr["new_confirmed"] > acc["new_confirmed"] ? curr : acc;
    }),
    deaths: dataset.reduce((acc, curr) => {
      return curr["new_deaths"] > acc["new_deaths"] ? curr : acc;
    }),
    recovery: dataset.reduce((acc, curr) => {
      return curr["new_recovered"] > acc["new_recovered"] ? curr : acc;
    }),
  };
}

function runUpdates({ cases, deaths, recovery }, covidData) {
  newConfirmed.innerText =
    "+ " + covidData[0]["new_confirmed"].toLocaleString("fr-FR");

  updateRecords(casesRecord, new Date(cases["date"]), cases["new_confirmed"]);
  updateRecords(deathRecord, new Date(deaths["date"]), deaths["new_deaths"]);
  updateRecords(
    recoveryRecord,
    new Date(recovery["date"]),
    recovery["new_recovered"]
  );
  updateCovidDetails(covidData[0]);

  // update charts
  google.charts.setOnLoadCallback(() =>
    drawPieChart(
      covidData[0]["active"],
      covidData[0]["recovered"],
      covidData[0]["deaths"]
    )
  );
  drawLineChart(
    covidData.map((day) => day["date"]).slice(1),
    covidData.map((day) => day["new_confirmed"]).slice(1),
    "line-chart"
  );
}
