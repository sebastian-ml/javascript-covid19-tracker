const hamburgerBtn = document.getElementsByClassName('hamburger')[0];
const hamburgerItem = hamburgerBtn.getElementsByClassName('hamburger__inactive')[0];
const mobileMenuList = document.getElementsByClassName('nav-mobile')[0]
    .getElementsByClassName('vertical-list')[0];

// Add or delete classes when user clicks the menu button
const showMobileMenu = () => {
    mobileMenuList.classList.toggle('vertical-list--active');
    hamburgerItem.classList.toggle('hamburger__inactive');
    hamburgerItem.classList.toggle('hamburger__active');
}

hamburgerBtn.addEventListener('click', showMobileMenu);

// Gather covid stats from the given site
function fetchStats(url) {
    return fetch(url)
        .then(response => response.json())
        .then(respJSON => respJSON.data)
}

const drawChart = (covidData, callback) => {
    // Save daily cases and dates into 2 arrays
    const timeline = [];
    const cases = [];
    covidData.forEach(day => {
        timeline.push(day['date']);
        cases.push(day['new_confirmed']);
    })

    // Draw a line chart with daily cases
    callback(timeline, cases);
}

function createElement(htmlTag, htmlClass= undefined, htmlId = undefined) {
    const newElement = document.createElement(htmlTag);
    if (htmlClass) newElement.classList.add(htmlClass);
    if (htmlId) newElement.id = htmlId;

    return newElement;
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

    Plotly.newPlot('line-chart', data, layout, config);
}