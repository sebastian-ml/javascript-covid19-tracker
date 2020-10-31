const url = 'https://corona-api.com/countries';
let countryArray;
const countriesCode = [];

// Gather all countries code and store in an array
fetch(url)
    .then((response) => response.json())
    .then((jsonResp) => countryArray = jsonResp.data)
    .then(() => countryArray.forEach((item) => countriesCode.push(item.code)))


google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
    const data = google.visualization.arrayToDataTable([
        ['Status', 'Cases'],
        ['Active', 20],
        ['Recovered', 10],
        ['Deaths', 5],
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

// Gather covid stats for the current day
fetch(allCasesUrl)
    .then((response) => response.json())
    .then(function (respJSON) {
        return respJSON.data[0];
    })
    .then((output) => updateDetails(output))

/**
 * Update details about covid
 *
 * @param currentInfo - Current corona statistics. Must be json.
 */
function updateDetails(currentInfo) {
    const covidContainer = document.getElementsByClassName('desc-list')[0];

    Array.from(covidContainer.children).forEach(function (item) {
        const total = item.getElementsByClassName('desc-list__main-value')[0];
        const today = item.getElementsByClassName('desc-list__second-value')[0];

        total.textContent = currentInfo[item.id];
        if (today) today.textContent = '+' + currentInfo[today.id]
    })
}




