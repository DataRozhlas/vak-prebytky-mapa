(function() {
    const data = [ //davky, lahvicky
        ["Hlavní město Praha",73975,16380],
        ["Jihomoravský kraj",35990,8385],
        ["Moravskoslezský kraj",29769,5070],
        ["Středočeský kraj",21323,5850],
        ["Jihočeský kraj",18514,3120],
        ["Olomoucký kraj",17778,3510],
        ["Královéhradecký kraj",13801,2925],
        ["Plzeňský kraj",13577,3315],
        ["Zlínský kraj",12572,2535],
        ["Ústecký kraj",10454,2730],
        ["Kraj Vysočina",10308,2340],
        ["Pardubický kraj",8821,2145],
        ["Liberecký kraj",7652,2340],
        ["Karlovarský kraj",5532,1365]
      ];

    mapData = [];
    data.forEach((row) => {
        const leftPct = (row[2] * 6 - row[1]) / (row[2] * 6);
        mapData.push([row[0], Math.round(leftPct * 1000) / 10])
    });

    const vals = mapData.map((r) => r[1]);

    fetch('https://data.irozhlas.cz/corona-map/kraje.json')
        .then((response) => response.json())
        .then((geojson) => {
            Highcharts.mapChart('vak-prebytky-mapa', {
                chart: {
                    map: geojson
                },
                credits: {
                    href: 'https://onemocneni-aktualne.mzcr.cz/api/v1/covid-19',
                    text: 'MZ ČR',
                },
                title: {
                    text: `Zbývající vakcíny v krajích`,
                    useHTML: true
                },
                subtitle: {
                    text: 'k 2. 2. 2021'
                },
                mapNavigation: {
                    enableMouseWheelZoom: false,
                    enabled: false,
                },
                colorAxis: {
                    tickPixelInterval: 100
                },
                tooltip: {
                    formatter: function() {
                        const rec = data.find((e) => e[0] === this.point.properties.NAZ_CZNUTS3)
                        return `<b>${this.point.properties.NAZ_CZNUTS3}</b><br>${rec[2]} lahviček (${rec[2] * 5} - ${rec[2] * 6} dávek)<br>podáno ${rec[1]} dávek<br>zbývá podat asi ${this.point.value} % dávek`
                    }
                },
                legend: {
                    enabled: false,
                },
                colorAxis: {
                    min: Math.min(...vals),
                    max: Math.max(...vals),
                    type: 'linear',
                    minColor: '#fee0d2',
                    maxColor: '#de2d26',
                    lineColor: 'green',
                    lineWidth: 10
                },

                series: [{
                    data: mapData,
                    keys: ['NAZ_CZNUTS3', 'value'],
                    joinBy: 'NAZ_CZNUTS3',
                    name: 'Podíl zbývajících dávek',
                    states: {
                        hover: {
                            color: '#de2d26'
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        format: '{point.properties.postal}'
                    }
                }]
            });
        })
})()