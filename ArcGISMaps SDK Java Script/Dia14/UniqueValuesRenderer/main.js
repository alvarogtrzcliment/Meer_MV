const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const UniqueValueRenderer = await $arcgis.import("@arcgis/core/renderers/UniqueValueRenderer.js");

const arcgisMap = document.querySelector('arcgis-map')
const redNat = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Red_Natura_2000/FeatureServer',
})

redNat.renderer = {
    type: "unique-value",
    field: "TIPO_NUEVO",
    uniqueValueInfos: [{
        value: "LIC",
        symbol: {
            type: "simple-fill",
            color: [225,0,0,1]
        }
    },
    {
        value: "ZEPA",
        symbol: {
            type: "simple-fill",
            color: [64, 124, 89]
        }
    },
    {
        value: "LIC/ZEPA",
        symbol: {
            type: "simple-fill",
            color: [255, 254, 76]
        }
    }]
};

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(redNat)
})