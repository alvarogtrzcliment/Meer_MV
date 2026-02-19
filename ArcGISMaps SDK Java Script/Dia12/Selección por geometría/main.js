// Imports
// Graph y Graphics Layer y Feature Layer
const Graphic = await $arcgis.import("@arcgis/core/Graphic.js");
const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");
const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
// Simbología
const SimpleFillSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleFillSymbol.js");
const SimpleMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleMarkerSymbol.js");
// Poligono
const Polygon = await $arcgis.import("@arcgis/core/geometry/Polygon.js");

// Query
const Query = await $arcgis.import("@arcgis/core/rest/support/Query.js");
// -------------------

// Llamamos al mapa
const arcgisMap = document.querySelector('arcgis-map')

// Creamos Capa HOSPITALES
const hospitalesFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'

})
console.log('hospitales', hospitalesFL)

// Polígono ()geometría, simbología grafico y capa gráfica
const poligono = new Polygon({
    rings: [
        [
            [-3.8, 40.45],
            [-3.6, 40.45],
            [-3.6, 40.38],
            [-3.8, 40.38],
            [-3.8, 40.45],
        ],
    ],
})

const simbologiaPoligono = new SimpleFillSymbol({
    color: [0, 103, 12, 0],
    outline: {
        cap: "round",
        color: [230, 192, 55, 1],
        join: "round",
        miterLimit: 1,
        style: "dash-dot",
        width: 2
    },
    style: "solid"
});

const graficoPoligono = new Graphic({
    geometry: poligono,
    symbol: simbologiaPoligono,
});

const capaGraficaPoligono = new GraphicsLayer()

capaGraficaPoligono.add(graficoPoligono)
console.log('capa poligono', capaGraficaPoligono)

// después de esto en el add event listener le metemos las capas

// ====   QUERY   ====

// 1º le metes la ubicación de la query por geometry, la que tiene qeu usar el la de la geometría del polígono
// todas estas características están en Properties del Query
const peticionHospitales = new Query({
    geometry: poligono,
    spatialRelationships: 'intersects',
    returnGeometry: true,
    outFields: ['*']
})

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(capaGraficaPoligono)

    // queryFeatures se encarga de "enviar la query a la capa que edtamos usando"

    // con la const guardo en una variable el resultado de la query
    const resultadoQuery = hospitalesFL.queryFeatures(peticionHospitales)


    resultadoQuery.then((resultadoFeatureSet) => {
        // entidades es un ARRAY, así que hay qeu meterle un iterador para que coja los objetos que devuelve la query
        const entidades = resultadoFeatureSet.features

        // PARA AÑADIR EL RESULTADO AL MAPA, hay que METERLE una SIMBOLOGÍA, el grafico ya esta creado, importa la simbologia solamente.
        const simbologiaPunto = new SimpleMarkerSymbol({
            angle: 84,
            color: [194, 0, 0, 1],
            outline: {
                cap: "round",
                color: [0, 122, 194, 1],
                join: "round",
                miterLimit: 1,
                style: "solid",
                width: 1
            },
            path: "undefined",
            size: 12,
            style: "circle",
            xoffset: 0,
            yoffset: 0
        });

        const entidadesConSimbologia = entidades.map((grafico) => {
            grafico.symbol = simbologiaPunto
            return grafico
        })
        // llenamos la capa con todo y lo añadimos todo al mapa
        const capaGraficaResultado = new GraphicsLayer({
            title: 'Hospitales'
        })
        capaGraficaResultado.addMany(entidadesConSimbologia)

        arcgisMap.map.add(capaGraficaResultado)
    })



})