// Imports para FeatureLayer y popups
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const PopupTemplate = await $arcgis.import('@arcgis/core/PopupTemplate.js')

// Seleccionamos el componente web de ArcGIS
const arcgisMap = document.querySelector('arcgis-map')

// 1. Configuración de la Plantilla de Popup
// Cómo se mostrarán los datos en el POPUP
const plantillaPopup = new PopupTemplate({
  title: '{Nombre}', // Título basado en campo "Nombre"
  content: [
    {
      type: 'fields', // El contenido será un listado de campos
      fieldInfos: [
        {
          fieldName: 'Direccion', // Nombre del campo en la capa
          label: 'Dirección'      // Etiqueta final
        },
        {
          fieldName: 'Telefono',
          label: 'Teléfono'
        },
        {
          fieldName: 'Municipio',
          label: 'Municipio'
        }
      ]
    }
  ]
})

// 2. Cargamos la capa de Hospitales
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0',
  popupTemplate: plantillaPopup // Relacionamos el popup con la capa
})

// 3. Añadir al mapa
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.add(hospitalesFL)
})
