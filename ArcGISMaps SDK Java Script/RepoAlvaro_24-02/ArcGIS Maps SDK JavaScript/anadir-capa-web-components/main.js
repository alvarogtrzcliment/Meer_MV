// Imports
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')

// Llamamos al ==arcgis-map== del HTML que contiene tanto el map como el view!!
const arcgisMap = document.querySelector('arcgis-map')

// Metemos el  EVENT LISTENER, que nos dirá cuándo la vista del mapa está lista
arcgisMap.addEventListener('arcgisViewReadyChange', (eventoViewReadyChange) => {
  // El evento se ejecutará cuando se termine de cargar la vista del Mapa

  // Creamos la capa
  const hospitalesFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
  })

  // Y la añadimos al `map` del componente arcgisMap
  arcgisMap.map.add(hospitalesFL)
})
