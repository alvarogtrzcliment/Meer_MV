// Imports: Capa de teselas de imágenes 
const ImageryTileLayer = await $arcgis.import(
  '@arcgis/core/layers/ImageryTileLayer.js')
// == Funciones específicas para análisis y renderizado de imágenes o rasters
const { bandArithmeticNDVI, colormap } = await $arcgis.import(
  '@arcgis/core/layers/support/rasterFunctionUtils.js')

// 1. Configuración NDVI: Índice de Vegetación
// Metes una función raster que calcula el NDVI, que contrasta las bandas (NIR) y (RED)
const ndviRF = bandArithmeticNDVI({
  nirBandId: 7, // banda 7 para Infrarrojo Cercano (NIR)
  redBandId: 3, // banda 3 para espectro RED
  scientificOutput: false
})

// 2. Configuración del Colormap, se le aplica una rampa de color de NDVIRF (funcion rastetr)
const colormapRF = colormap({
  colorRampName: 'NDVI3',
  raster: ndviRF // Conectamos el resultado anterior: NDVIRF
})

// 3. Creación de la capa de Imagen (ImageryTileLayer)
// Cargamos la imagen de satélite (Sentinel-2) y le aplicamos nuestra función raster en tiempo real
const incendioITL = new ImageryTileLayer({
  url: 'https://tiledimageservices1.arcgis.com/MPSkeshhtFz9vjCL/arcgis/rest/services/Imagen_Incendio_Canarias___Sentinel_2/ImageServer',
  rasterFunction: colormapRF // Asignamos la función configurada para aplicarle color según NDVI
})

// Seleccionamos el mapa
const arcgisMap = document.querySelector('arcgis-map')

// 4. Lo metemos en el mapa
// EventListener cuando la vista de mapa 
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Añadimos la capa al mapa
  arcgisMap.map.add(incendioITL)
})
