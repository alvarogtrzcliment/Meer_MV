// === 1. IMPORTACIONES ===
const Point = await $arcgis.import('@arcgis/core/geometry/Point.js') // Estructura de Puntos base
const SimpleMarkerSymbol = await $arcgis.import(
  '@arcgis/core/symbols/SimpleMarkerSymbol.js' // Clase para modificar color y forma de Puntos
)
const Graphic = await $arcgis.import('@arcgis/core/Graphic.js') // Objeto empaquetador "Geometría + Símbolo"
const GraphicsLayer = await $arcgis.import(
  '@arcgis/core/layers/GraphicsLayer.js' // Capa diseñada exclusivamente para contener Graphics manuales
)

// === 2. AÑADIR PUNTOS AL MAPA ===

// a. Creación Geometría
// Definimos el Punto en España.
const geometriaPunto = new Point({
  latitude: 41.4,
  longitude: -4
})

console.log('Geometría', geometriaPunto)

// b. Simbología (en GitHub Symbol builder)
const simbologiaPunto = new SimpleMarkerSymbol({
  angle: 0,
  color: [15, 255, 143, 1], // relleno RGBA (Verdimar)
  outline: {
    cap: 'round',
    color: [0, 122, 194, 1], // Borde azul 
    join: 'round',
    miterLimit: 1,
    style: 'solid',
    width: 4 // Grosor del borde (muy grueso)
  },
  path: 'undefined',
  size: 12,
  style: 'x', // Forma de cruz 
  xoffset: 0,
  yoffset: 0
})

// c. Unes ambas con Graphic
const graficoPunto = new Graphic({
  geometry: geometriaPunto, // posición
  symbol: simbologiaPunto   // aspecto
  // ya estan la geometría y la simbología, ahora podemos usarlo
})

// === 3. CREACIÓN Y ASIGNACIÓN A LA CAPA ===
// Los gráficos pertenecen a Capas Gráficas
const capaGraficaGL = new GraphicsLayer()

// Insertamos nuestro Graphic en la Capa de Gráficos
capaGraficaGL.add(graficoPunto)


// === 4. ACCESO AL MAPA ===
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Cargamos esta capa en mapa
  arcgisMap.map.add(capaGraficaGL)
})
