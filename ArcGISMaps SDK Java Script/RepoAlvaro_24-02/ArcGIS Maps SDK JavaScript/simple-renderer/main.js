// Imports FL, SimpleRenderer y SimpleMarkerSymbol (Opcionales con autocasting)
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const SimpleRenderer = await $arcgis.import('@arcgis/core/renderers/SimpleRenderer.js')
const SimpleMarkerSymbol = await $arcgis.import('@arcgis/core/symbols/SimpleMarkerSymbol.js')

// Seleccionamos el mapa 
const arcgisMap = document.querySelector('arcgis-map')

// === 1. FORMA 1: DEFINICIÓN EXPLÍCITA === 
// Instanciamos pasando las clases correspondientes , NECESITAS EL IMPORTS
// const hospitalesRenderer = new SimpleRenderer({
//   symbol: new SimpleMarkerSymbol({
//     color: 'red',
//     outline: {
//       color: [128, 128, 128, 0.5],
//       width: '0.5px'
//     }
//   })
// })

// === 2. FORMA 2: DEFINICIÓN IMPLÍCITA (AUTOCASTING) ===
// Indicando la propiedad "type". La API luego lo transformará e instanciará ella sola.
const hospitalesRenderer = {
  type: 'simple', // Equivale a "SimpleRenderer"
  symbol: {
    type: 'simple-marker', // Equivale a "SimpleMarkerSymbol"
    color: 'red',
    outline: {
      color: [128, 128, 128, 0.5],
      width: '0.5px'
    }
  }
}

// 3. Modificación de la apariencia original de la capa
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0',
  renderer: hospitalesRenderer // Sobrescribimos el diseño de nube original por los diamantes/círculos rojos
})

// 4. Se añade al mapa cuando carga
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.add(hospitalesFL)
})
