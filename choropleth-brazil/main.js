var svg = d3.select('svg'),
    width = + svg.attr('width'),
    height = + svg.attr('height'),
    g = svg.append('g');

var brData = d3.map();

var projection = d3.geoMiller()
    .center([-42, -15])
    .scale(600);

var path = d3.geoPath()
    .projection(projection);

d3.queue()

    // JSON font: https://gist.github.com/ruliana/bdfc5e34063f2cd57062bd198440599d
    .defer(d3.json, 'brazil.json')

    // Data from: http://dados.gov.br/dataset/transferencias-constitucionais-para-estados
    .defer(d3.tsv, 'idh.tsv', dataLoaded)
    .await(ready);

function dataLoaded(d) {
    brData.set(d.id, +d.rate);
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
            return stateColor(brData.get(d.id))
        });
    g.append('path')
        .datum(states_contour)
        .attr('d', path)
        .attr('class', 'state_contour');
}

function stateColor(rate) {
    if (rate >= 0 && rate <= 20) {
        return '#ff0000';
    }

    return '#ccc';
}

