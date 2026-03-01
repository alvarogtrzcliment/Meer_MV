// Imports capa imágenes raster(tiles) dinámicos
const ImageryTileLayer = await $arcgis.import(
  '@arcgis/core/layers/ImageryTileLayer.js')

// Selección de Web Components del HTML
const arcgisMap = document.querySelector('arcgis-map') // El mapa
const arcgisSwipe = document.querySelector('arcgis-swipe') // El swipe

// Creación Capas de Imagen 

// Incendio con color natural (RGB), 
// componiendo las bandas 3, 2, y 0 -> se sabía por algo de la capa,
const incendioNaturalColorITL = new ImageryTileLayer({
  url: 'https://tiledimageservices1.arcgis.com/MPSkeshhtFz9vjCL/arcgis/rest/services/Imagen_Incendio_Canarias___Sentinel_2/ImageServer',
  bandIds: [3, 2, 0], //Color Natural
  effect: 'brightness(5) contrast(200%)' // Efectos para mejorar visualización
})

// Incendio geológico --> Necesitas otra capa igual pero con las bandas de otro color
const incendioGeologicoITL = new ImageryTileLayer({
  url: 'https://tiledimageservices1.arcgis.com/MPSkeshhtFz9vjCL/arcgis/rest/services/Imagen_Incendio_Canarias___Sentinel_2/ImageServer',
  bandIds: [11, 10, 1],
  effect: 'brightness(5) contrast(200%)'
})

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.addMany([incendioNaturalColorITL, incendioGeologicoITL])
  arcgisSwipe.startLayers.add(incendioNaturalColorITL)
  arcgisSwipe.endLayers.add(incendioGeologicoITL)
})

// Funcionalidad Botón

const botonCalcite = document.querySelector('calcite-button')

let estadoBoton = 'geo'

botonCalcite.addEventListener('click', () => {
  console.log(estadoBoton)

  if (estadoBoton === 'geo') {
    incendioGeologicoITL.bandIds = [10, 7, 1]
    botonCalcite.innerHTML = 'Geológico'
    estadoBoton = 'agro'
  } else {
    incendioGeologicoITL.bandIds = [11, 10, 1]
    botonCalcite.innerHTML = 'Agricultura'
    estadoBoton = 'geo'
  }
})


// OTRA MANERA DE HACERLO
// function addLayersToMap() {
//   arcgisMap.map?.addMany([incendioNaturalColorITL, incendioGeologicoITL])
//   arcgisSwipe.startLayers.add(incendioNaturalColorITL)
//   arcgisSwipe.endLayers.add(incendioGeologicoITL)
// }
// await arcgisMap.viewOnReady()
// addLayersToMap()

// arcgisSwipe.addEventListener('arcgisPropertyChange', () => {
//   if (arcgisSwipe.state === 'ready') {
//     arcgisSwipe.startLayers.add(incendioNaturalColorITL)
//     arcgisSwipe.endLayers.add(incendioGeologicoITL)
//   }
// })
