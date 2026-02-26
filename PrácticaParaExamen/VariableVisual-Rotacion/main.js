const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js');
const ClassBreaksRenderer = await $arcgis.import("@arcgis/core/renderers/ClassBreaksRenderer.js");

const arcgisMap = document.querySelector('arcgis-map')

const renderizadorPorClases = new ClassBreaksRenderer({
    // Este renderer es para que las flechas cojan el tono rojo/azul según la temperatura de la zona
    field: "TEMP",
    classBreakInfos: [
        // Aquello con temperaturas de -10 - 25
        {
            minValue: -10,
            maxValue: 25,
            symbol: {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                path: "M14.5,29 23.5,0 14.5,9 5.5,0z",
                color: '#2365ab',
                outline: {
                    color: [0, 0, 0, 0.7],
                    width: 0.5,
                },
            }
        },
        // Aquello con temperaturas de 26 - 31
        {
            minValue: 26,
            maxValue: 31,
            symbol: {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                path: "M14.5,29 23.5,0 14.5,9 5.5,0z",
                color: '#eeeeee',
                outline: {
                    color: [0, 0, 0, 0.7],
                    width: 0.5,
                },
            }
        },
        // Aquello con temperaturas de 32 - 82
        {
            minValue: 32,
            maxValue: 82,
            symbol: {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                path: "M14.5,29 23.5,0 14.5,9 5.5,0z",
                color: '#c42b1c',
                outline: {
                    color: [0, 0, 0, 0.7],
                    width: 0.5,
                },
            }
        },
    ],
    // la variable visual para que se rote según la dirección del viento 
    // y tenga el tamaño según la velocidad del viento
    visualVariables: [
        {
            type: "rotation",
            field: "WIND_DIRECT",
            rotationType: "geographic",
        },
        {
            type: "size",
            field: "WIND_SPEED",
            minDataValue: 0,
            maxDataValue: 60,
            minSize: 8,
            maxSize: 40,
        },
    ]
});

const estacionesMetFL = new FeatureLayer({
    url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/weather_stations_010417/FeatureServer/0',
    renderer: renderizadorPorClases
})

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(estacionesMetFL)
    console.log('Estaciones con simbología propia añadidas')
})