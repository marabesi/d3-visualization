/**
 * Inspired by http://bl.ocks.org/mthh/7e17b680b35b83b49f1c22a3613bd89f
 */
var margin = { top: 50, right: 80, bottom: 50, left: 80 },
    width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

var data = [
    { name: 'Software testing',
        axes: [
            { "value": "48", "axis": "software"},
            { "value": "33", "axis": "code"},
            { "value": "24", "axis": "test"},
            { "value": "20", "axis": "source"},
            { "value": "19", "axis": "testing"},
            { "value": "19", "axis": "research"},
            { "value": "18", "axis": "techniques"},
            { "value": "18", "axis": "design"},
            { "value": "17", "axis": "models"},
            { "value": "16", "axis": "quality"},
            { "value": "16", "axis": "metrics"},
            { "value": "16", "axis": "empirical"},
            // { "value": "16", "axis": "based"},
            // { "value": "15", "axis": "model"},
            // { "value": "15", "axis": "information"},
            // { "value": "14", "axis": "defect"},
            // { "value": "13", "axis": "results"},
            // { "value": "13", "axis": "development"},
            // { "value": "13", "axis": "detection"},
            // { "value": "13", "axis": "analysis"},
            // { "value": "12", "axis": "system"},
            // { "value": "12", "axis": "studies"},
            // { "value": "11", "axis": "prediction"},
            // { "value": "11", "axis": "notations"},
            // { "value": "10", "axis": "visual"},
            // { "value": "10", "axis": "provide"},
            // { "value": "10", "axis": "paper"},
            // { "value": "9 ", "axis": "time"},
            // { "value": "9 ", "axis": "study"},
        ]
    }
];

var radarChartOptions = {
    w: 390,
    h: 330,
    margin: margin,
    levels: 5,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(["#26AF32", "#762712"]),
    format: '.0f'
};

RadarChart('.radarChart', data, radarChartOptions);
