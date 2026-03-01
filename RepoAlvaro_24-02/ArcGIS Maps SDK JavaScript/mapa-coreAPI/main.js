// Imports (cuando no se usan los nuevos Web Components (<arcgis-map>))
const Map = await $arcgis.import('@arcgis/core/Map.js')
const MapView = await $arcgis.import('@arcgis/core/views/MapView.js')

// Creación de una instancia de Mapa (gestiona las capas y el tipo de mapa base (topográfico, satélite, mapa de calles...))
const miMapa = new Map({
  basemap: 'topo-vector' // Seleccionamos el formato topográfico simplificado y vectorial
})

// Creacmos la Ventana como tal (MapView) (dibuja el anterior objeto mapa estático y genera la ventana interactiva en la página Web)
const vistaMapa = new MapView({
  // el contenedor será el div que hemos creado antes
  container: 'viewDiv', // !! Debe coincidir con el 'id' de un div HTML (<div id="viewDiv"></div>)
  map: miMapa // Enlazamos a nuestro mapa creado justo arriba
})
