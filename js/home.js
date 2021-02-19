google.charts.load("current", {packages:["corechart"]});

const casesRecord = document.getElementById('daily-cases-record');
const deathRecord = document.getElementById('death-rate-record');
const recoveryRecord = document.getElementById('most-recovered-record');
const newConfirmed = document.getElementById('new_confirmed_important');

const covidStatsURL = 'https://corona-api.com/timeline';
const covidDataset = {
    allCases: 'covidCasesWorld',
    casesByCountry: 'covidCasesByCountry'
};

(function () {
    let covidData;
    const isDataInStorage = sessionStorage.getItem(covidDataset['allCases']);

    if (!isDataInStorage) {
        covidData = fetchData(covidStatsURL);
    } else {
        covidData = new Promise((resolve, reject) => {
            resolve(JSON.parse(isDataInStorage));
        });
    }

    covidData.then(stats => {
        sessionStorage.setItem(covidDataset['allCases'], JSON.stringify(stats));

        const records = {
            cases: stats.reduce((acc, curr) => {
                return curr['new_confirmed'] > acc['new_confirmed'] ? curr : acc;
            }),
            deaths: stats.reduce((acc, curr) => {
                return curr['new_deaths'] > acc['new_deaths'] ? curr : acc;
            }),
            recovery: stats.reduce((acc, curr) => {
                return curr['new_recovered'] > acc['new_recovered'] ? curr : acc;
            }),
        }

        newConfirmed.innerText = ('+ ' + stats[0]['new_confirmed'].toLocaleString('fr-FR'));
        updateRecords(casesRecord, new Date(records['cases']['date']), records['cases']['new_confirmed']);
        updateRecords(deathRecord, new Date(records['deaths']['date']), records['deaths']['new_deaths']);
        updateRecords(recoveryRecord, new Date(records['recovery']['date']), records['recovery']['new_recovered']);
        updateCovidDetails(stats[0]);

        // update charts
        google.charts.setOnLoadCallback(() => drawPieChart(
            stats[0]['active'],
            stats[0]['recovered'],
            stats[0]['deaths'],
        ));
        drawLineChart(
            (stats.map(day => day['date'])).slice(1),
            (stats.map(day => day['new_confirmed'])).slice(1),
            'line-chart'
        );
    });
})();
