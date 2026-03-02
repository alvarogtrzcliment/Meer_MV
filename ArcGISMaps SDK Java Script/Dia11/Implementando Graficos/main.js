// Hay que hacer GEOMETRIA y SIMBOLOGÍA y una CAPA GRÁFICA de 
// un punto, polilínea y polígono --> METELAS TODAS EN UN MAPA

// === 1. Imports ===

// Geometrías
const Point = await $arcgis.import('@arcgis/core/geometry/Point.js')
const Polyline = await $arcgis.import('@arcgis/core/geometry/Polyline.js')

// Simbologías
const SimpleMarkerSymbol = await $arcgis.import('@arcgis/core/symbols/SimpleMarkerSymbol.js') // Representa puntos
const SimpleLineSymbol = await $arcgis.import('@arcgis/core/symbols/SimpleLineSymbol.js')  // Representa líneas

// Gráficos Base y Capa Gráfica
const Graphic = await $arcgis.import('@arcgis/core/Graphic.js') // Estructura de "Geometría + Simbología"
const GraphicsLayer = await $arcgis.import('@arcgis/core/layers/GraphicsLayer.js') // Capa que contendrá los Graphics creados

// === CÓDIGO ===

// A. Geometrías
// Punto según la Latitud y Longitud
const geometriaPunto = new Point({
  latitude: 41,
  longitude: -4
})

// Polilínea con un array de nodos que forman su trayectoria
const geometriaLinea = new Polyline({
  paths: [
    [41, -3], // Primer vértice de coordenada XY
    [41, -2]  // Segundo final de la línea
  ]
})

// También podemos declarar geometrías con autocasting
// Generamos un polígono con 3 puntos (x, y)
const geometriaPoligono = {
  type: 'polygon', // Especificamos el tipo
  rings: [
    [42, -3],
    [42, -2],
    [41, -1]
  ]
}

// B. Simbologías
// Del punto
const simbologiaPunto = new SimpleMarkerSymbol({
  angle: 0,
  color: [255, 255, 255, 0.25], // Transparencia aplicada al color blanco
  outline: {
    cap: 'round',
    color: [0, 122, 194, 1],
    join: 'round',
    miterLimit: 1,
    style: 'solid',
    width: 1
  },
  path: 'undefined',
  size: 12,
  style: 'circle',
  xoffset: 0,
  yoffset: 0
})

// De la Polilínea
const simbologiaLinea = new SimpleLineSymbol({
  cap: 'round',
  color: [0, 122, 194, 1], // Azul
  join: 'round',
  miterLimit: 1,
  style: 'solid',
  width: 1
})

// Vía (Autocast) Polígono
const simbologiaPoligono = {
  type: 'simple-fill',
  color: [0, 122, 194, 1],
  outline: {
    cap: 'round',
    color: [0, 122, 194, 1],
    join: 'round',
    miterLimit: 1,
    style: 'solid',
    width: 1
  },
  style: 'solid'
}

// === 3. CREACIÓN DE LOS GRÁFICOS (Graphics) ===
//Graphic une geometry, y  symbology

const graficoPunto = new Graphic({
  geometry: geometriaPunto,
  symbol: simbologiaPunto
})

const graficoLinea = new Graphic({
  geometry: geometriaLinea,
  symbol: simbologiaLinea
})

const graficoPoligono = new Graphic({
  geometry: geometriaPoligono,
  symbol: simbologiaPoligono
})

// === 4. CREACIÓN DE Graphics Layers ===
// Para mostralos en el mapa, deben estar en una GraphicsLayer (varias formas de hacerlo:)

// 1. Instancia pasando los gráficos como parámetros en el constructor
const capaPuntos = new GraphicsLayer({
  graphics: [graficoPunto]
})

// 2. Instancia vacía y agregando progresivamente usando el método '.add()'
const capaPolilinea = new GraphicsLayer()
capaPolilinea.add(graficoLinea)

const capaPoligono = new GraphicsLayer()
capaPoligono.add(graficoPoligono)

// === 5. AÑADIR AL MAPA ===
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Utilizamos addMany para agrupar las capas y meterlas de una
  arcgisMap.map.addMany([capaPoligono, capaPolilinea, capaPuntos])
})
