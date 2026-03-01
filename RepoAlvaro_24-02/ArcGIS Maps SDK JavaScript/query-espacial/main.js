// Importaciones de módulos necesarios
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const Polygon = await $arcgis.import('@arcgis/core/geometry/Polygon.js') // Geometría superficial
const SimpleFillSymbol = await $arcgis.import(
  '@arcgis/core/symbols/SimpleFillSymbol.js' // Relleno de polígonos
)
const Graphic = await $arcgis.import('@arcgis/core/Graphic.js')
const GraphicsLayer = await $arcgis.import(
  '@arcgis/core/layers/GraphicsLayer.js'
)
const Query = await $arcgis.import('@arcgis/core/rest/support/Query.js') // Peticiones SQL y Espaciales a servicios
const WebStyleSymbol = await $arcgis.import(
  '@arcgis/core/symbols/WebStyleSymbol.js' // Símbolos especiales en 3D (como animales/vehículos) almacenados en portal
)

// Seleccionamos la Vista Web Component conectada al mapa
const arcgisMap = document.querySelector('arcgis-map')

// 1. Capa de Datos Objetivo
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
})

// === 2. CREAMOS UN POLÍGONO DE ANÁLISIS ===
// Queremos investigar qué hospitales caen dentro de este cuadro imaginario
const geometriaPoligono = new Polygon({
  rings: [
    [
      // Coordenadas XY configurando un cuadro/rectángulo cerrado
      [-3.8, 40.45],
      [-3.6, 40.45],
      [-3.6, 40.38],
      [-3.8, 40.38],
      [-3.8, 40.45] // Se repite el primero para cerrar la figura
    ]
  ]
})

// Simbología transparente con borde azul para ver qué hay debajo del rectángulo
const simbologiaPoligono = new SimpleFillSymbol({
  color: [0, 122, 194, 0], // Transparente 100%
  outline: {
    cap: 'round',
    color: [0, 122, 194, 1], // Borde azul 100% solido
    join: 'round',
    miterLimit: 1,
    style: 'solid',
    width: 1
  },
  style: 'solid'
})

// Generamos el gráfico y lo alojamos en una capa gráfica
const poligonoGrafico = new Graphic({
  geometry: geometriaPoligono,
  symbol: simbologiaPoligono
})

const capaGraficaPoligono = new GraphicsLayer({
  graphics: [poligonoGrafico],
  title: 'Capa del Polígono'
})

// === 3. CONFIGURAMOS LA QUERY ESPACIAL ===

const peticionHospitales = new Query({
  geometry: geometriaPoligono, // Pasamos nuestra geometría de caja delimitadora
  returnGeometry: true, // Necesitamos que nos devuelvan dónde están los puntos impactados para pintarlos
  spatialRelationship: 'intersects', // RELACIÓN ESPACIAL: Los que "toquen" o "caigan dentro" de la geometría
  outFields: ['*']
})

// === 4. EJECUTAMOS LA CONSULTA Y RENDERIZAMOS ===

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Añadimos el recuadro para visualizar dónde estuvimos buscando
  arcgisMap.map.add(capaGraficaPoligono)

  // Disparamos la petición al servidor (Asíncrona, devuelve Promesa)
  const resultadosQueryHospitales = hospitalesFL.queryFeatures(peticionHospitales)

  // Tras resolverse la Promesa...
  resultadosQueryHospitales.then((resultadosFeatureSet) => {

    // Obtenemos los elementos que dieron positivo en la intersección
    const entidades = resultadosFeatureSet.features

    // Creamos un estilo de mapa personalizado trayendo un Modelo de un "Gorila" desde el catálogo online
    const simbologiaGorila = new WebStyleSymbol({
      name: 'Gorilla',
      styleUrl: 'https://www.arcgis.com/sharing/rest/content/items/1fbb242c54e4415d9b8e8a343ca7a9d0/data'
    })

    // Sustituimos la apariencia original de estos hospitales con el nuevo símbolo 3D
    const entidadesConSymbologia = entidades.map((entidadGrafico) => {
      entidadGrafico.symbol = simbologiaGorila
      return entidadGrafico
    })

    // Declaramos nuestra capa final
    const capaGraficaResultado = new GraphicsLayer({
      title: 'Hospitales con Gorilas'
    })

    // Agregamos todos los resultados mapeados y los pintamos en el DOM
    capaGraficaResultado.addMany(entidadesConSymbologia)

    arcgisMap.map.add(capaGraficaResultado)
  })
})
