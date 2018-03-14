// Based on http://www.limn.co.za/2013/10/making-a-cartogram/

var colour_map = {
    'ANC': '#FFCC00',
    'DA': '#005CA7',
    'BA': '#005CA7',
    'IFP': '#FF1800'
};

var map = d3.select('#map');

var munics = map.append('g')
    .attr('id', 'munics')
    .selectAll('path');

var proj = d3.geo.albers()
    .origin([-40, -14.2])
    .parallels([-22.1, -34.1])
    .scale(700);

var topology,
    geometries,
    carto_features;

var vote_data = d3.map();

var carto = d3.cartogram()
    .projection(proj)
    .properties(function (d) {
        return d.properties;
    });

d3.csv('data/voting_data.csv', function (data) {
    data.forEach(function (d) {
        vote_data.set(d.MUNIC, [d.PARTY, d.VOTERS, d.VOTES]);
    })
});

d3.json('brazil.json', function (data) {
    topology = data;
    geometries = topology.objects.estados.geometries;

    var features = carto.features(topology, geometries);
    var path = d3.geo.path()
        .projection(proj);

    munics = munics.data(features)
        .enter()
        .append('path')
        .attr('class', 'munic')
        .attr('id', function (d) {
            return d.id;
        })
        .attr('stroke', '#000')
        .attr('fill', function (e) {
            var current = colour_map[e.id];
            if (current) {
                return current;
            }

            return '#ccc';
        })
        .attr('d', path);

    munics.append('title')
        .text(function (d) {
            return d.properties.nome;
        });

    d3.select('#click_to_run').text('click here to run');
});

function add(a, b) {
    return a + b;
}

function do_update() {
    d3.select('#click_to_run').text('thinking...');

    setTimeout(function () {
        carto.value(function (d) {
            var number =  +vote_data.get(d.id)[2];
            return number;
        });


        if (carto_features == undefined)
            carto_features = carto(topology, geometries).features;

        munics.data(carto_features)
            .select('title')
            .text(function (d) {
                return d.properties.nome;
            });

        munics.transition()
            .duration(750)
            .each('end', function () {
                d3.select('#click_to_run').text('done')
            })
            .attr('d', carto.path);
    }, 10);
}
