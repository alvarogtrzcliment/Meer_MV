const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const PopupTemplate = await $arcgis.import("@arcgis/core/PopupTemplate.js");


const arcgisMap = document.querySelector('arcgis-map')

const plantillaPopup = new PopupTemplate({
    title: "{Nombre}",
    // el array tiene que estar dentro de content. El array tiene muchos objetos dentro, uno por fila de la zº
    content:   [
        {
            type: "fields", // Autocasts as new FieldsContent()
            // Autocasts as new FieldInfo[]
            fieldInfos: [
                {
                    fieldName: "Municipio",
                    label: "Municipio",
                },
                {
                    fieldName: "Direccion",
                    label: "Dirección",
                },
                {
                    fieldName: "Clase_de_Centro",
                    label: "Clase de Centro",
                },
                {
                    fieldName: "Telefono",
                    label: "Teléfono de contacto",
                } 
            ]
        }]
})

const hospitalesFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0',
    popupTemplate: plantillaPopup
})


arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(hospitalesFL)
})
