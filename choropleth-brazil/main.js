window.addEventListener('load', load);

const brData = d3.map();

const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const g = svg.append('g');

const projection = d3.geoMiller()
    .center([-42, -15])
    .scale(600);

const path = d3.geoPath()
    .projection(projection);

const color = d3.scaleThreshold()
    .domain([0, 1, 10, 100, 1000, 10000, 100000, 1000000])
    .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

const x = d3.scaleLinear()
    .domain([1, 10]);

function load() {
    const select = document.querySelector('select');
    select.addEventListener('change', (event) => {
        const selected = event.srcElement.value;
        build(selected)
    });

    build('Dec-01');
}

function build(type) {
    d3.queue()

    // JSON font: https://gist.github.com/ruliana/bdfc5e34063f2cd57062bd198440599d
        .defer(d3.json, 'brazil.json')

    // Data from: http://dados.gov.br/dataset/transferencias-constitucionais-para-estados
        .defer(d3.csv, 'transmen201802.csv', dataLoaded)
        .await(ready);

    function dataLoaded(d) {
        brData.set(d.UF, +d[type]);
    }

    function ready(error, shp) {
        if (error) throw error;

        const states = topojson.feature(shp, shp.objects.estados);
        const states_contour = topojson.mesh(shp, shp.objects.estados);

        g.selectAll('.estado')
            .data(states.features)
            .enter()
            .append('path')
            .attr('class', 'state')
            .attr('d', path)
            .attr('fill', (d) => {
                return color(brData.get(d.id))
            });
        g.append('path')
            .datum(states_contour)
            .attr('d', path)
            .attr('class', 'state_contour');

        g.call(d3.axisBottom(x)
            .tickSize(10)
            .tickFormat((x, i) => i ? x : x + '%')
            .tickValues(color.domain()))
            .select('.domain')
            .remove();
    }
}
