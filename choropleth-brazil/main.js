window.addEventListener('load', load);

var brData = d3.map();

var svg = d3.select('svg'),
    width = +svg.attr('width'),
    height = +svg.attr('height'),
    g = svg.append('g');


var projection = d3.geoMiller()
    .center([-42, -15])
    .scale(600);

var path = d3.geoPath()
    .projection(projection);

var color = d3.scaleThreshold()
    .domain([0, 1, 10, 100, 1000, 10000, 100000, 1000000])
    .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

function load() {
    var select = document.querySelector('select');
    select.addEventListener('change', function(event) {
        var selected = event.srcElement.value;
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

        var states = topojson.feature(shp, shp.objects.estados);
        var states_contour = topojson.mesh(shp, shp.objects.estados);

        g.selectAll('.estado')
            .data(states.features)
            .enter()
            .append('path')
            .attr('class', 'state')
            .attr('d', path)
            .attr('fill', function(d) {
                return color(brData.get(d.id))
            });
        g.append('path')
            .datum(states_contour)
            .attr('d', path)
            .attr('class', 'state_contour');
    }
}
