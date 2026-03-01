// Importación dinámica de los módulos de ArcGIS necesarios a través del envoltorio $arcgis
const Map = await $arcgis.import('@arcgis/core/Map.js')
const MapView = await $arcgis.import('@arcgis/core/views/MapView.js')
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')

// 1. Creación del objeto de Mapa
// Nuevo mapa especificando el tipo de mapa base (aquí topográfico vectorial)
const mapa = new Map({
  // Con LLAVES se crea un objeto, despues ponemos el TIPO DE MAPA BASE
  basemap: 'topo-vector'
})

// 2. Creación de la Vista del Mapa (MapView)
// == VISTA: interfaz gráfica donde se dibuja el mapa.
const vistaMapa = new MapView({
  // 'container' apunta al id del div donde se mostrará.
  container: 'viewDiv',
  map: mapa
})

// 3. Creación de Capas (FeatureLayer) creada desde una URL directa a un servicio de entidades de ArcGIS REST
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
})

// Otra alternativa de capa, cargada indirectamente usando el ID de un elemento (PortalItem) en ArcGIS Online
const hospitalesPortalItemFL = new FeatureLayer({
  portalItem: {
    id: '68745a7fb7a348b6b0d722c8517790af'
  }
})

// 4. Añadir la capa al mapa para que se visualice
mapa.add(hospitalesPortalItemFL)

