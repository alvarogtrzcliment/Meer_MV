// Imports FC y ClassBreaksRenderer
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
// == ClassBreaksRenderer: colorea polígonos o puntos según rangos numéricos.
const ClassBreaksRenderer = await $arcgis.import(
  '@arcgis/core/renderers/ClassBreaksRenderer.js')

// Seleccionamos el web map
const arcgisMap = document.querySelector('arcgis-map')

// 1. Configuramos el Renderizador, asocia el campo numérico que determinará la simbología ('F_POBLACION__Población')
const renderizadorPorClases = new ClassBreaksRenderer({
  field: 'F_POBLACION__Población'
})

// 2. Definimos Rangos y Simbología
// Rango 1: Población de 0 a 10.000 habitantes (Color Rojo)
renderizadorPorClases.addClassBreakInfo({
  minValue: 0,
  maxValue: 10000,
  symbol: {
    type: 'simple-fill', // Relleno simple para polígonos
    color: 'red'
  }
})

// Rango 2: Población de 10.000 a 30.000 habitantes (Color Naranja)
renderizadorPorClases.addClassBreakInfo({
  minValue: 10000,
  maxValue: 30000,
  symbol: {
    type: 'simple-fill',
    color: 'orange'
  }
})

// Rango 3: Población de 30.000 a 90.000 habitantes (Color Amarillo)
renderizadorPorClases.addClassBreakInfo({
  minValue: 30000,
  maxValue: 90000,
  symbol: {
    type: 'simple-fill',
    color: 'yellow'
  }
})

// 3. Creamos la capa y aplicamos el Renderizador(Zonas Básicas de Salud en la Comunidad de Madrid)
const zonasBasicasFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/ZONAS_BASICAS_SALUD_MADRID/FeatureServer/0',
  renderer: renderizadorPorClases // Asignamos el estilo basado en clases creado previamente
})

// 4.  Añadimos la simbolgía al mapa cuando esté listo
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.add(zonasBasicasFL)
})
