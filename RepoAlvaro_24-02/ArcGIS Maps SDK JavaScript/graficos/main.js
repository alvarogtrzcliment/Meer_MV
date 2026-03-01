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

// a. Creación de la Geometría
// Definimos expresamente qué son los datos espaciales. En este caso un Punto estático en coordenadas de España.
const geometriaPunto = new Point({
  latitude: 41.4,
  longitude: -4
})

console.log('Geometría', geometriaPunto)

// b. Simbología Visual
// Creamos un estilo de tipo "Simple", pero podemos configurarlo profundamente
const simbologiaPunto = new SimpleMarkerSymbol({
  angle: 0,
  color: [15, 255, 143, 1], // Un color de relleno en formato RGBA (Verdimar)
  outline: {
    cap: 'round',
    color: [0, 122, 194, 1], // Borde azul 
    join: 'round',
    miterLimit: 1,
    style: 'solid',
    width: 4 // Grosor del delineado del marcador (muy grueso)
  },
  path: 'undefined',
  size: 12,
  style: 'x', // Forma de Equis/cruz en vez de círculo estándar
  xoffset: 0,
  yoffset: 0
})

// c. Unificación en el Objeto 'Graphic'
// Un Graphic es el vehículo indispensable para llevar nuestra información al mapa
const graficoPunto = new Graphic({
  geometry: geometriaPunto, // Su posición en la tierra
  symbol: simbologiaPunto   // Su aspecto en el lienzo
})

// === 3. CREACIÓN Y ASIGNACIÓN A LA CAPA ===
// Los gráficos no pueden flotar solos ni ser tirados al web map directamente, pertenecen a Capas Gráficas
const capaGraficaGL = new GraphicsLayer()

// Insertamos nuestro Graphic "construido y decorado" a la Capa de Gráficos
capaGraficaGL.add(graficoPunto)


// === 4. ACCESO AL MAPA ===
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Cargamos esta capa en nuestro mapa base final una vez listo todo
  arcgisMap.map.add(capaGraficaGL)
})
