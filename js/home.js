google.charts.load("current", {packages:["corechart"]});

const casesRecord = document.getElementById('daily-cases-record');
const deathRecord = document.getElementById('death-rate-record');
const recoveryRecord = document.getElementById('most-recovered-record');
const globalDetails = document.getElementById('global-details');
const newConfirmed = document.getElementById('new_confirmed_important');

const covidStatsURL = 'https://cors-anywhere.herokuapp.com/https://corona-api.com/timeline';
const covidDataset = {
    allCases: 'covidCasesWorld',
    casesByCountry: 'covidCasesByCountry'
};

(function () {
    let covidData;

    if (!sessionStorage.getItem(covidDataset['allCases'])) {
        covidData = fetchSomeData(covidStatsURL);
    } else {
        covidData = new Promise((resolve, reject) => {
            resolve(JSON.parse(sessionStorage.getItem(covidDataset['allCases'])));
        });
    }

    covidData
        .then(stats => {
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
            updateCovidDetails(stats[0], globalDetails);

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

/**
 * Update details about covid on the page.
 *
 * @param covidStats - Current corona statistics. Must be json.
 * @param htmlContainer - An html container where covid data should be put
 */
function updateCovidDetails(covidStats, htmlContainer) {
    const statisticsContainer = htmlContainer.getElementsByClassName('desc-list')[0];

    Array.from(statisticsContainer.children).forEach(child => {
        const total = child.getElementsByClassName('desc-list__main-value')[0];
        const today = child.getElementsByClassName('desc-list__second-value')[0];

        total.append(parseFloat(covidStats[child.id]).toLocaleString('fr-FR'));

        if (today) today.append(
            '+ ' + parseFloat(covidStats[today.id]).toLocaleString('fr-FR')
        );
    })

    // Update information about the time when the data was updated
    const lastUpdate = new Date(covidStats['updated_at']);
    const lastUpdateContainer = document.getElementById('last-update');

    lastUpdateContainer.dateTime = lastUpdate;
    lastUpdateContainer.innerText = lastUpdate.toUTCString();
}
