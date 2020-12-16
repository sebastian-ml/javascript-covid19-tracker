const hamburgerBtn = document.getElementsByClassName('hamburger')[0];
const hamburgerStatus = hamburgerBtn.getElementsByClassName('hamburger__inactive')[0];
const mobileMenuList = document.getElementsByClassName('nav-mobile')[0]
    .getElementsByClassName('vertical-list')[0];

hamburgerBtn.addEventListener('click', () => {
    mobileMenuList.classList.toggle('vertical-list--active');
    hamburgerStatus.classList.toggle('hamburger__inactive');
    hamburgerStatus.classList.toggle('hamburger__active');
})

function fetchSomeData(url) {
    return fetch(url)
        .then(response => response.json())
        .then(respJSON => respJSON.data)
}

function createHtmlElement(htmlTagName, htmlClassName, htmlID) {
    const newElement = document.createElement(htmlTagName);

    if (htmlClassName) newElement.classList.add(htmlClassName);
    if (htmlID) newElement.id = htmlID;

    return newElement;
}

/**
 * Draw a line chart.
 *
 * @param xaxis - The array of x values.
 * @param yaxis - The array of y values.
 * @param containerID - The ID of a html element where the chart should be draw.
 */
function drawLineChart(xaxis, yaxis, containerID) {
    const trace1 = {
        x: xaxis,
        y: yaxis,
        mode: 'lines',
        connectgaps: true,
        line: {
            color: 'rgba(227,27,27,0.82)',
        }
    };

    const data = [trace1];
    const layout = {
        left: 0,
        top: 0,
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

    Plotly.newPlot(containerID, data, layout, config);
}

/**
 * Draw a chart with the given data. All arguments should be integers.
 *
 * @param active - Active covid cases.
 * @param recovered - Currently recovered covid cases.
 * @param deaths - People who died from covid.
 */
function drawPieChart(active, recovered, deaths) {
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
 * Update a card with current covid records
 *
 * @param container - html container which should be updated. Must be a DOM
 * @param date - date of record. Must be a Date object.
 * @param cases - number of cases. Must be a number
 */
function updateRecords(container, date, cases) {
    container.getElementsByClassName('card__important')[0].innerText = '+ ' + cases;

    const dayWrapper = container.getElementsByClassName('calendar-sheet__day')[0];
    const monthWrapper = container.getElementsByClassName('calendar-sheet__month')[0];
    const yearWrapper = container.getElementsByClassName('calendar-sheet__year')[0];

    dayWrapper.innerText = date.getDate();
    dayWrapper.dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    monthWrapper.innerText = date.getMonth() + 1;
    monthWrapper.dateTime = `${date.getFullYear()}-${date.getMonth() + 1}`;

    yearWrapper.innerText = date.getFullYear();
    yearWrapper.dateTime = `${date.getFullYear()}`;
}
