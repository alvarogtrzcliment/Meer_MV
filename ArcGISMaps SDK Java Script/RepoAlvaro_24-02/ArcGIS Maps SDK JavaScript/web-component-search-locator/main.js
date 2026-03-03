// Imports FL
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')

// Seleccionamos el mapa
const arcgisMap = document.querySelector('arcgis-map')

// 1. Origenes de la Búsqueda
// Cargamos la capa para el Localizador
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
})

// 2. Selección del Web Search (del HTML)
const searchWebComponent = document.querySelector('arcgis-search')

// 3. Configurar SearchBar (EventListener para cuando termine de inicializarse ('arcgisReady'))
searchWebComponent.addEventListener('arcgisReady', (customEvent) => {
  // Alteramos la lista de orígenes o fuentes de resultados
  // Por defecto el buscador usa el geocodificador global del mundo de Esri
  searchWebComponent.sources = [
    {
      layer: hospitalesFL, // Base de datos objetivo
      searchFields: ['Nombre', 'Municipio'], // ¿Qué columnas o campos consultará para coincidir?
      displayField: 'Nombre', // El campo que da el título mostrado en la ventana de detalle final
      // exactMatch: false,   // --- Si el término introducido debe ser exactamente idéntico y sensible a comillas!!!
      outFields: ['*'],       // Atributos que descargar al hacer click --- * = all!!!
      suggestionTemplate: '{Nombre}, {Municipio}', // Texto base durante el sugeridor (autocompletado)
      placeholder: 'Hospital García Orcoyen, Estella-Lizarra' // Texto del cajón de búsqueda está vacío
    }
  ]
})
