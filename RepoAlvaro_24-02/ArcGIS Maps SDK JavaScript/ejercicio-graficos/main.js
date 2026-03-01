// === 1. IMPORTACIONES (Imports) ===

// a. Geometrías (Definen la forma espacial y ubicación)
const Point = await $arcgis.import('@arcgis/core/geometry/Point.js')
const Polyline = await $arcgis.import('@arcgis/core/geometry/Polyline.js')

// b. Simbologías (Definen los colores y el estilo visual)
const SimpleMarkerSymbol = await $arcgis.import(
  '@arcgis/core/symbols/SimpleMarkerSymbol.js' // Usado para representar puntos
)
const SimpleLineSymbol = await $arcgis.import(
  '@arcgis/core/symbols/SimpleLineSymbol.js' // Usado para representar líneas
)

// c. Gráficos Base y Capa Gráfica
const Graphic = await $arcgis.import('@arcgis/core/Graphic.js') // Estructura de "Geometría + Simbología"
const GraphicsLayer = await $arcgis.import(
  '@arcgis/core/layers/GraphicsLayer.js' // Capa que contendrá los Graphics creados
)

// === 2. DECLARACIÓN DEL CÓDIGO ===

// A. Geometrías
// Se crea una geometría de Punto puro estableciendo la Latitud y Longitud
const geometriaPunto = new Point({
  latitude: 41,
  longitude: -4
})

// Se crea una geometría de Polilínea aportando un array de nodos que forman su trayectoria
const geometriaLinea = new Polyline({
  paths: [
    [41, -3], // Primer vértice de coordenada XY
    [41, -2]  // Segundo vértice, donde finaliza la línea
  ]
})

// Opcionalmente podemos declarar geometrías usando el formato crudo autocast (directamente un objeto normal en JSON)
// Aquí generamos un polígono con un anillo o frontera exterior de 3 puntos (x, y)
const geometriaPoligono = {
  type: 'polygon', // Especificamos el tipo
  rings: [
    [42, -3],
    [42, -2],
    [41, -1]
  ]
}

// B. Simbologías
// Estilo para el punto establecido arriba
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

// Estilo simple e intuitivo para la línea (Polilínea)
const simbologiaLinea = new SimpleLineSymbol({
  cap: 'round',
  color: [0, 122, 194, 1], // Azul
  join: 'round',
  miterLimit: 1,
  style: 'solid',
  width: 1
})

// Simbología vía objeto convencional (Autocast) para el Polígono
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
// A diferencia de lo anterior, el objeto "Graphic" ensambla y vincula
// la 'geometría' que dijimos dónde pintar, con la 'symbology' para cómo pintarla.

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

// === 4. CREACIÓN DE LAS CAPAS DE DIBUJO (Graphics Layers) ===
// Para mostrar gráficos en un mapa de ArcGIS, estos deben existir dentro de una GraphicsLayer.

// Instancia pasando los gráficos como parámetros en el constructor
const capaPuntos = new GraphicsLayer({
  graphics: [graficoPunto]
})

// O instanciando vacío y agregando progresivamente usando el método '.add()'
const capaPolilinea = new GraphicsLayer()
capaPolilinea.add(graficoLinea)

const capaPoligono = new GraphicsLayer()
capaPoligono.add(graficoPoligono)

// === 5. AÑADIR AL MAPA ===
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Cuando el componente de webmap está renderizado y listo...
  // Utilizamos addMany para agrupar las capas e inyectarlas visualmente de una sola pasada.
  arcgisMap.map.addMany([capaPoligono, capaPolilinea, capaPuntos])
})
