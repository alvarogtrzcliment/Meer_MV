
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js');

const arcgisMap = document.querySelector('arcgis-map')

const nivelEstudiosFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/YFraetVkEAF1lMag/ArcGIS/rest/services/Nivel_estudios_y_población_por_CCAA_2021/FeatureServer/1',
    renderer: {
        type: 'simple',
        symbol: {
            type: "simple-marker",  // autocasts as new PictureMarkerSymbol()
            color: 'blue'
        },
        visualVariables: [
            {
                type: "size",
                field: "Poblacion",
                minDataValue: 63000,
                maxDataValue: 7500000,
                minSize: 8,
                maxSize: 40
            }
        ]
    },

})

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(nivelEstudiosFL)
})
