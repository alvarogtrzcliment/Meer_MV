// Importar la capa
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const Query = await $arcgis.import("@arcgis/core/rest/support/Query.js");
const SimpleMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleMarkerSymbol.js");
const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");

// Selecciono el mapa
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', (eventoViewReadyChange) => {
    // Este evento se ejucta cuando se carga la vista del Mapa

    // Creamos la capa
    const hospitalesFL = new FeatureLayer({
        url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
    })

    // Añadimos la capa al mapa
    //   arcgisMap.map.add(hospitalesFL) !!!!!!!

    // Para crear la query, en la documentacion del siguiente enlace, y lo cargo(copiado en los imports): 
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-Query.html

    const peticionQuery = new Query({
        where: "Provincia='Segovia' Or Provincia='Ávila'",
        returnGeometry: true,
        outFields: ['*']
    })

    // RESULTADO ES UNA PROMESA!!!
    // El resultado es un feature set, de la docum se que es un array.
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-FeatureSet.html

    const resultadoQuery = hospitalesFL.queryFeatures(peticionQuery)
    resultadoQuery.then((resultadoFeatureSet) => {
        // .then con resultado sfeatures set es porque lo que viene de laquery es un feature set
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

        const entidadesConSimbologia = entidades.map((grafico)=>{
            grafico.symbol = simbologiaPunto
            return grafico 
        })
// llenamos la capa con todo y lo añadimos todo al mapa
        const capaGraficaGL = GraphicsLayer
        capaGraficaGL.addMany(entidadesConSimbologia)
        arcgisMap.map.add(capaGraficaGL)
    })

    console.log(resultadoQuery)
})