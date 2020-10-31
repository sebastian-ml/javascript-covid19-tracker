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
        // title: 'My Daily Activities',
        // pieHole: 0.3,
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
