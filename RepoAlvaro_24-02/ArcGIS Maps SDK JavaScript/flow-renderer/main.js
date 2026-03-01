// Imports Raster/Imagery Layer y el FLOW RENDERER (especial para flujos meteorológicos/marítimos)
const ImageryTileLayer = await $arcgis.import(
  '@arcgis/core/layers/ImageryTileLayer.js')
const FlowRenderer = await $arcgis.import(
  '@arcgis/core/renderers/FlowRenderer.js'
)

// 1. Configuramos el FlowRenderer (toma datos vectoriales (como U/V de velocidad de viento) 
// los inserta en una imagen y los anima)
const vientoRenderer = new FlowRenderer({
  flowSpeed: 35,       // Velocidad de las líneas asíncronas
  trailWidth: '1px',   // Grosor de las estelas
  trailLength: 250,    // Largo visual maximo de las estelas
  density: 1,          // Densidad de estelas en pantalla
  visualVariables: [   // == Las variables visuales adaptan el trazo según los valores reales de los datos
    {
      type: 'color',   // Modifica dinámicamente el color
      field: 'Magnitude', // Usa la magnitud intrínseca de los datos (Fuerza del campo magnético/viento)
      // Escala térmica de colores
      stops: [
        { value: 0, color: 'darkblue' }, // Valores desde cero (flojo) son azules
        { value: 6, color: 'green' },   // Valores intermedios verdes
        { value: 25, color: 'red' }      // Valores muy altos (fuerte) son rojos
      ]
    }
  ]
})

// 3. Creamos la capa y asignamos el estilo
// Lee el servicio de viento/temperatura (NLDAS_Hourly)
const vientoITL = new ImageryTileLayer({
  url: 'https://tiledimageservices.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/NLDAS_Hourly_8_30_2021/ImageServer',
  renderer: vientoRenderer,       // Acoplamos la animación de líneas y colores configurada arriba
  effect: 'bloom(1.5,0.5px,0)'    // Efecto visual brillo de neón para mayor espectacularidad
})

// Obtenemos el mapa
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Cuando se cagra el mapa, metemos la capa meteorológica
  arcgisMap.map.add(vientoITL)
})
