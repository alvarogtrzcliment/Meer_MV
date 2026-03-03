// Importas FL
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')

// Seleccionamos el mapa
const arcgisMap = document.querySelector('arcgis-map')

// 1. Capa
const poblacionFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/YFraetVkEAF1lMag/arcgis/rest/services/Nivel_estudios_y_poblaci%C3%B3n_por_CCAA_2021/FeatureServer', // Origen: Comunidades Autónomas 2021

  // A. Estilo Base del Renderizador
  // Autocasting (type: 'simple') para no importar Clases explícitamente.
  renderer: {
    type: 'simple', // "SimpleRenderer" 
    symbol: {
      type: 'simple-marker', // Punto (SimpleMarkerSymbol)
      color: 'blue'          // Todos serán azules
    },

    // B. Variable Visual Superpuesta
    // Transforma el "Simple Renderer" en una simbología proporcional sin escribir tanto código
    visualVariables: [
      {
        type: 'size',       // Variable visual de "Tamaño" (Proportional Symbol)
        field: 'Poblacion', // Atado a la población de cada comunidad

        // Cada círculo escala dinmámicamente según:
        minDataValue: 63000,   // Comunidades con < = a esta población
        maxDataValue: 7500000, // Comunidades con > = a esta población
        minSize: 8,            // ... Tamaño mínimo (8px/pts)
        maxSize: 40            // ... Tamaño máximo (40px/pts)
      }
    ]
  }
})

// === 2. Añadimos al mapa ===
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.add(poblacionFL)
})
