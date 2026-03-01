// Imports: Capa de teselas de imágenes 
const ImageryTileLayer = await $arcgis.import(
  '@arcgis/core/layers/ImageryTileLayer.js')
// Y funciones específicas para análisis y renderizado de imágenes o rasters
const { bandArithmeticNDVI, colormap } = await $arcgis.import(
  '@arcgis/core/layers/support/rasterFunctionUtils.js')

// 1. Configuración del Índice de Vegetación (NDVI)
// Se define una función raster que calcula el NDVI utilizando aritmética de bandas
// El NDVI contrasta la banda infrarroja (NIR) con la roja (RED)
const ndviRF = bandArithmeticNDVI({
  nirBandId: 7, // Asignamos la banda número 7 para el Infrarrojo Cercano (NIR)
  redBandId: 3, // Asignamos la banda número 3 para el espectro Rojo
  scientificOutput: false
})

// 2. Configuración del Mapa de Color (Colormap)
// Se le aplica una rampa de color predefinida al resultado de la función NDVI
const colormapRF = colormap({
  colorRampName: 'NDVI3',
  raster: ndviRF // Conectamos el resultado del NDVI generado anteriormente
})

// 3. Creación de la capa de Imagen (ImageryTileLayer)
// Cargamos la imagen de satélite (Sentinel-2) y le aplicamos nuestra función raster en tiempo real
const incendioITL = new ImageryTileLayer({
  url: 'https://tiledimageservices1.arcgis.com/MPSkeshhtFz9vjCL/arcgis/rest/services/Imagen_Incendio_Canarias___Sentinel_2/ImageServer',
  rasterFunction: colormapRF // Asignamos la función configurada para aplicarle color según NDVI
})

// Seleccionamos el mapa del HTML
const arcgisMap = document.querySelector('arcgis-map')

// 4. Integración en el mapa
// Escuchamos a que el renderizado de la vista de mapa esté completo
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Cuando está listo, añadimos la capa con el análisis raster al mapa
  arcgisMap.map.add(incendioITL)
})
