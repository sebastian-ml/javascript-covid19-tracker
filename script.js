const url = 'https://corona-api.com/countries';
let countryArray;
const countriesCode = [];

// Gather all countries code and store in an array
fetch(url)
    .then((response) => response.json())
    .then((jsonResp) => countryArray = jsonResp.data)
    .then(() => countryArray.forEach((item) => countriesCode.push(item.code)))


google.charts.load("current", {packages:["corechart"]});

/**
 * Draw a chart with the given data. All arguments should be integers.
 *
 * @param active - Active covid cases.
 * @param recovered - Currently recovered covid cases.
 * @param deaths - People who died from covid.
 */
function drawChart(active, recovered, deaths) {
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


const allCasesUrl = 'https://corona-api.com/timeline';

// Gather covid stats for the current day, update info on the site and draw a chart
fetch(allCasesUrl)
    .then((response) => response.json())
    .then(function (respJSON) {
        return respJSON.data[0];
    })
    .then(function (covidData) {
        updateDetails(covidData);
        google.charts.setOnLoadCallback(drawChart(
            covidData['active'],
            covidData['recovered'],
            covidData['deaths'],
            ));
    })

/**
 * Update details about covid on the page.
 *
 * @param currentInfo - Current corona statistics. Must be json.
 */
function updateDetails(currentInfo) {
    const covidContainer = document.getElementsByClassName('desc-list')[0];
    document.getElementById('new_confirmed_important')
        .textContent = '+ ' + currentInfo['confirmed'].toLocaleString('fr-FR');

    Array.from(covidContainer.children).forEach(function (item) {
        const total = item.getElementsByClassName('desc-list__main-value')[0];
        const today = item.getElementsByClassName('desc-list__second-value')[0];

        // Update covid cases and add separator to the numbers
        total.textContent = parseFloat(currentInfo[item.id]).toLocaleString('fr-FR');
        if (today) today.textContent = '+ '
            + parseFloat(currentInfo[today.id]).toLocaleString('fr-FR');
    })

    // Update information about the time when the data was downloaded
    const lastUpdate = new Date(currentInfo['updated_at']);
    const lastUpdateContainer = document.getElementById('last-update');
    lastUpdateContainer.dateTime = lastUpdate;
    lastUpdateContainer.textContent = lastUpdate.toUTCString();
}





