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
        return respJSON.data;
    })
    .then(function (covidData) {
        const dailyStats = covidData[0]
        updateDetails(dailyStats);
        google.charts.setOnLoadCallback(drawChart(
            dailyStats['active'],
            dailyStats['recovered'],
            dailyStats['deaths'],
            ));

        // Save daily cases and dates into 2 arrays
        const timeline = [];
        const cases = [];
        covidData.forEach(function (day) {
            timeline.push(day['date']);
            cases.push(day['new_confirmed']);
        })

        // Draw a line chart with daily cases
        drawLineChart(timeline, cases);
    })

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

/**
 * Draw a line chart with the given data.
 *
 * @param xaxis - The array of x values.
 * @param yaxis - The array of y values.
 */
function drawLineChart(xaxis, yaxis) {
    const trace1 = {
        x: xaxis.slice(1),
        y: yaxis.slice(1),
        mode: 'lines',
        connectgaps: true,
        line: {
            color: 'rgba(227,27,27,0.82)',
        }
    };

    const data = [trace1];

    const layout = {
        showlegend: false,
        plot_bgcolor: '#242424',
        paper_bgcolor: 'transparent',
        font: {
            family: 'Lato, sans-serif',
        },
        xaxis: {
            title: {
                text: 'Date',
                font: {
                    family: 'Lato, sans-serif',
                    size: 15,
                },
            },
            color: 'rgba(255,255,255,0.76)',
        },
        yaxis: {
            title: {
                text: 'New confirmed cases',
                font: {
                    family: 'Lato, sans-serif',
                    size: 15,
                }
            },
            color: 'rgba(255,255,255,0.76)',
            zeroline: true,
            zerolinecolor: 'rgba(210,210,210,0.56)',
        },
    };

    const config = {responsive: true}

    Plotly.newPlot('line-chart', data, layout, config);
}









