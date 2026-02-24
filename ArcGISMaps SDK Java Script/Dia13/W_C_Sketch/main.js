const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js');
const arcgisMap = document.querySelector('archis-map')
const sketch = document.querySelector('arcgis-sketch')
const Query = await $arcgis.import("@arcgis/core/rest/support/Query.js");
const SimpleMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleMarkerSymbol.js");

const hospitalesFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
})

const capaGraficaResultados = new GraphicsLayer()
const capaGraficaHospitalesResultados = new GraphicsLayer()

const simbologiaPunto = new SimpleMarkerSymbol({
  angle: 0,
  color: [51,255,221,1],
  outline: {
    cap: "round",
    color: [122,0,204,1],
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

sketch.addEventListener('arcgisReady', () => {
    sketch.layer = capaGraficaResultados
})
// esta capa gráfica, se llenará de las cosas que dibujes, al pintar desaparecen las cosas deseparecen

sketch.addEventListener('arcgisCreate', (customEvent) => {
    console.log(customEvent)

    if (
        customEvent.detail.state === 'complete' &&
        customEvent.detail.tool === 'point'
    ) {
        // para que quite los hospitales encontrados en el anterior punto, "LIMPIA LA CAPA "
        capaGraficaHospitalesResultados.removeAll()
        const geometriaPunto = customEvent.detail.graphic.geometry

        console.log(geometriaPunto)

        const parametrosQuery = new Query({
            geometry: geometriaPunto,
            spatialRelationship: 'intersects',
            distance: 10,
            units: 'kilometers',
            returnGeometry: true,
            outFields: ['*']
        })

        const resultadoQuery = hospitalesFL.queryFratures(parametrosQuery)

        //        ESTO ES UNA PROMESA!!!!!

        resultadoQuery.then((resultadoFeatureSet) => {
            const entidades = resultadoFeatureSet.features
            const entidadesConSimbologia = entidades.map((hospital) => {
                    hospital.symbol = simbologiaPunto
                    return hospital
            })
            capaGraficaHospitalesResultados.addMany(entidadesConSimbologia)
        })
    }
})

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(capaGraficaResultados)
    arcgisMap.map.add(capaGraficaHospitalesResultados)
})