const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const SimpleRenderer = await $arcgis.import("@arcgis/core/renderers/SimpleRenderer.js");
const SimpleMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleMarkerSymbol.js");
const ClassBreaksRenderer = await $arcgis.import("@arcgis/core/renderers/ClassBreaksRenderer.js");

const arcgisMap = document.querySelector('arcgis-map')

const hospitalesRenderer = new SimpleRenderer({
    // ambas se pueden ahcer así o poner directamente ( type:sumplemarkersimbol, etc, y no habría uqe importar nada)
    symbol: new SimpleMarkerSymbol({
        size: 6,
        color: "cyan",
        outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "cyan"
        }
    })
});



const hospitalesFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0',
    renderer: hospitalesRenderer
})

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(hospitalesFL)
})