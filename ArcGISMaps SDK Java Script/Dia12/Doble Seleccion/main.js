//  -------------   Imports  --------------
const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");

const Query = await $arcgis.import("@arcgis/core/rest/support/Query.js");

const PictureMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/PictureMarkerSymbol.js");

const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");

// -------------   Código  --------------

// Llamamos al mapa
const arcgisMap = document.querySelector('arcgis-map')

// ====   EVENT LISTENER  ====

arcgisMap.addEventListener('arcgisViewReadyChange', (eventoViewReadyChange) => {

    // Capas 
    const paisesMundo = new FeatureLayer({
        url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries/FeatureServer',
    })
    console.log('paises', paisesMundo)

    const incendiosMundo = new FeatureLayer({
        url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/ArcGIS/rest/services/MODIS_Thermal_v1/FeatureServer/1',
    })
    console.log('incendios', incendiosMundo)
    // como no las añado al mapa no se ven

    // SIMBOLOGÍA fuera paraa qeu no se haga 84 millones de veces, la metemos arriba

    const simboloIncendio = new PictureMarkerSymbol({
        angle: 0,
        height: 100,
        url: "https://sagewall.github.io/test-images/globie.png",
        width: 100,
        xoffset: 0,
        yoffset: 0
    });

    // ahora queremos representar los incendios en el mapa --> EN UNA CAPA VACÍA que para que no se repita 85 veces, la hacemos arriba fuera de los iteradores
                const capaIncenciosGL = new GraphicsLayer({
                    title:'Incendios'
                })
                

    //  ====   QUERY #1 - ESP  ====

    const peticionEsp = new Query({
        // where es lo más importante porque es lo que coge el atributo y su tipo
        where: "ISO_CC='ESP'",
        // le pido qeu me devuelva la geometría porque es lo que busco, la forma de españa
        returnGeometry: true
    })
    console.log('query españa', peticionEsp)

    // metes en una constante el resultado de la query, para hacer la promesa
    const resultadoEsp = paisesMundo.queryFeatures(peticionEsp)

    resultadoEsp.then((resultadoEspFeatureSet) => {

        const espanya = resultadoEspFeatureSet.features
        // esto ya te da el array de polígonos que compone españa
        console.log('Array España', espanya)

        espanya.map((poligonoEspanya) => {
            // en este iterador entra de uno en uno cada polígono de españa
            console.log('Polígonos de España', poligonoEspanya)
            const geometriaPoligono = poligonoEspanya.geometry
            // TODO LO QUE SE ESCRIBA AQUÍ SE REPITE N VECES
            // hacemos aquí la query #2 porque la geometría está aquí y es lo que necesito

            //  ====   QUERY #2 - INCENDIOS  ====

            const queryIncendios = new Query({

                geometry: geometriaPoligono,
                returnGeometry: true,
                spatialRelationship: 'intersects'
            })

            // hacemos la llamada a la capa de incendios que es de la que quiero sacar la info
            const resultadoQueryIncendios = incendiosMundo.queryFeatures(queryIncendios)

            resultadoQueryIncendios.then((resultadoIncendiosFeatureSet) => {
                const incendios = resultadoIncendiosFeatureSet.features
                // simbología fuera paraa qeu no se haga 84 millones de veces, la metemos arriba
                const incendiosConSimbologia = incendios.map((incendioGrafico)=>{

                    incendioGrafico.symbol = simboloIncendio
                    return incendioGrafico
                })

                capaIncenciosGL.addMany(incendiosConSimbologia)
                 
            })

        })
arcgisMap.map.add(capaIncenciosGL)
    })

})