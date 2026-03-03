// Imports FL & HeatmapRenderer (permite representar gran densidad de puntos como "manchas de calor" continuas)
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const HeatmapRenderer = await $arcgis.import(
  '@arcgis/core/renderers/HeatmapRenderer.js'
)

// 1. Estilo Mapa de Calor
const hospitalesRenderer = new HeatmapRenderer({
  // Transición de colores(de - a +)
  colorStops: [
    { ratio: 0, color: 'rgba(255, 255, 255, 0)' },   // Zonas vacías = transparente
    { ratio: 0.2, color: 'rgba(255, 255, 255, 1)' }, // Pocos puntos = blanco
    { ratio: 0.5, color: 'rgba(255, 140, 0, 1)' },   // Densidad media = naranja claro
    { ratio: 0.8, color: 'rgba(255, 140, 0, 1)' },   // Densidad alta = naranja oscuro
    { ratio: 1, color: 'rgba(255, 0, 0, 1)' }        // Máxima densidad/calientes = rojo
  ],
  minDensity: 0,   // Nivel mínimo para el renderizado
  maxDensity: 0.1, // A partir de el se será el color más intenso (ratio=1)
  radius: 10       // Radio de influencia visual de un punto (en pixeles o ptos)
})

// 2. Cargamos la capa
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0',
  renderer: hospitalesRenderer // Sustituimos los puntos estándar por las manchas de calor
})

// 3. Contenedor (arcgis-map) e inyectar la capa
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.add(hospitalesFL) // Se añade al mapa al estar lista la vista
})
