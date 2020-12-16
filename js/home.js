google.charts.load("current", {packages:["corechart"]});

const casesRecord = document.getElementById('daily-cases-record');
const deathRecord = document.getElementById('death-rate-record');
const recoveryRecord = document.getElementById('most-recovered-record');

const allCasesUrl = 'https://cors-anywhere.herokuapp.com/https://corona-api.com/timeline';
const covidDataset = {
    allCases: 'covidCasesWorld',
    casesByCountry: 'covidCasesByCountry'
};

(function () {
    let covidData;

    if (!sessionStorage.getItem(covidDataset['allCases'])) {
        covidData = fetchSomeData(allCasesUrl);
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

            updateRecords(casesRecord, new Date(records['cases']['date']), records['cases']['new_confirmed']);
            updateRecords(deathRecord, new Date(records['deaths']['date']), records['deaths']['new_deaths']);
            updateRecords(recoveryRecord, new Date(records['recovery']['date']), records['recovery']['new_recovered']);

            updateDetails(stats[0]);
            createPieChart(stats[0]);
            drawLineChart(
                (stats.map(day => day['date'])).slice(1),
                (stats.map(day => day['new_confirmed'])).slice(1),
                'line-chart'
            );
        });
})();

function createPieChart(data) {
    google.charts.setOnLoadCallback(() => chart(
        data['active'],
        data['recovered'],
        data['deaths'],
    ));
}

/**
 * Draw a chart with the given data. All arguments should be integers.
 *
 * @param active - Active covid cases.
 * @param recovered - Currently recovered covid cases.
 * @param deaths - People who died from covid.
 */
function chart(active, recovered, deaths) {
    const data = google.visualization.arrayToDataTable([
        ['Status', 'Cases'],
        ['Active', active],
        ['Recovered', recovered],
        ['Deaths', deaths],
    ]);

    const options = {
        legend: 'none',
        chartArea: {
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
        },
        colors: ['#f7cc20', '#8fb447', '#bf3c39'],
        backgroundColor: { fill:'transparent' },
        fontSize: 15,
        is3D: true,
        pieSliceTextStyle: {
            color: 'black'
        }
    };

    const chart = new google.visualization.PieChart(document.getElementById('donut-chart'));

    chart.draw(data, options);
}

/**
 * Update details about covid on the page.
 *
 * @param currentInfo - Current corona statistics. Must be json.
 */
function updateDetails(currentInfo) {
    const covidContainer = document.getElementsByClassName('desc-list')[0];
    document.getElementById('new_confirmed_important')
        .textContent = '+ ' + currentInfo['new_confirmed'].toLocaleString('fr-FR');

    Array.from(covidContainer.children).forEach(function (item) {
        const total = item.getElementsByClassName('desc-list__main-value')[0];
        const today = item.getElementsByClassName('desc-list__second-value')[0];

        // Update covid cases and add separator to the numbers
        total.innerHTML += parseFloat(currentInfo[item.id]).toLocaleString('fr-FR');
        if (today) today.innerHTML += '+ '
            + parseFloat(currentInfo[today.id]).toLocaleString('fr-FR');
    })

    // Update information about the time when the data was downloaded
    const lastUpdate = new Date(currentInfo['updated_at']);
    const lastUpdateContainer = document.getElementById('last-update');
    lastUpdateContainer.dateTime = lastUpdate;
    lastUpdateContainer.textContent = lastUpdate.toUTCString();
}

