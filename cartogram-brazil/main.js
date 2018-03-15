/**
 * This cartogram is based on http://www.limn.co.za/2013/10/making-a-cartogram,
 * which is a simplification from http://prag.ma/code/d3-cartogram/ (Shawn Allen).
 * For more info see Jeff Fletcher's post at http://www.limn.co.za/2013/10/making-a-cartogram/
 */

var colors = d3.scale.linear()
    .domain([10, 46232200])
    .range(['#ccc', '#999'])
    .range(['#dadaeb', '#54278f'])

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

// http://dados.gov.br/dataset/mpog_mcmv
d3.csv('data/MCMV_03_2012.csv', function (data) {
    data.forEach(function (d) {
        vote_data.set(d.UF, [d.Valor]);
    })

    d3.json('brazil.json', function (data) {
        topology = data;
        geometries = topology.objects.estados.geometries;

        const features = carto.features(topology, geometries);
        const path = d3.geo.path()
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
                return colors(vote_data.get(e.id).reduce(add));
            })
            .on('mouseover', function(d) {
                const el = document.querySelector('.info');
                el.setAttribute('style', 'display: block');

                const state= document.querySelector('#state');
                state.innerHTML = d.properties.nome;

                const amount = document.querySelector('#amount');
                amount.innerHTML = formatWithComma(vote_data.get(d.id).reduce(add));
                console.log(d)
            })
            .on('mouseout', function(d) {
                 const el = document.querySelector('.info');
                el.setAttribute('style', 'display: none');
            })
            .attr('d', path);

        munics.append('title')
           .text(function (d) {
               return d.properties.nome;
           });

        d3.selectAll('path').each(function(g) {
            var t = document.createElement('text');

            this.parentNode.insertBefore(t, this.nextSibling);

            d3.select(t)
                .attr("class", "nodetext")
             // https://dillieodigital.wordpress.com/2013/02/13/quick-tip-getting-the-centroid-of-an-individual-svg-path-selection-in-d3/
             // .attr('x', function(d,i){
             //     return h.centroid(d)[0]; // horizontal center of path
             // })
             // .attr('y', function(d,i){
             //     return path.centroid(d)[1] + 13; // vertical center of path
             // })
             .attr('text-anchor','middle')
             .text(function (d) {
                 return g.id;
             })
             .text(function(d) {
                 return g.properties.nome;
             });
        });

        d3.select('#click_to_run').text('Show cartogram');
    });
});

function add(a, b) {
    return a + b;
}

function formatWithComma(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function do_update() {
    d3.select('#click_to_run').text('thinking...');

    setTimeout(function () {
        carto.value(function (d) {
            var number = +vote_data.get(d.id).reduce(add);

            if (number === 0) {
               return 0.1;
            }

            number = number * 10;

            return number;
        });

        if (carto_features == undefined) {
            carto_features = carto(topology, geometries).features;
        }

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
