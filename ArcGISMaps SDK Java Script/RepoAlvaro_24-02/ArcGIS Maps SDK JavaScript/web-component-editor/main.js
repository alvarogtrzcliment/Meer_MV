// Imports FL
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')

// Seleccionamos el mapa
const arcgisMap = document.querySelector('arcgis-map')

// 1. Capa Habilitada para Edición (La posibilidad de edición depende de la publicación en AGOL
const capaEditableFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/MPSkeshhtFz9vjCL/arcgis/rest/services/Capa_Editable_/FeatureServer'
})

// 2. Cargamos la capa editable al web map
// El componente `<arcgis-editor>` actuará solo en cualquier capa que soporte la edición que provea el mapa base principal.
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.add(capaEditableFL)
})
