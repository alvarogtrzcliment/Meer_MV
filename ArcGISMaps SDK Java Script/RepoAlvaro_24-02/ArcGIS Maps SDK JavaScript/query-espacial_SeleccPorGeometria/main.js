// Imports
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
// Geometría superficial
const Polygon = await $arcgis.import('@arcgis/core/geometry/Polygon.js')
// Relleno de polígonos
const SimpleFillSymbol = await $arcgis.import('@arcgis/core/symbols/SimpleFillSymbol.js')
const Graphic = await $arcgis.import('@arcgis/core/Graphic.js')
const GraphicsLayer = await $arcgis.import('@arcgis/core/layers/GraphicsLayer.js')
// Peticiones SQL y Espaciales a servicios
const Query = await $arcgis.import('@arcgis/core/rest/support/Query.js')
// Símbolos especiales en 3D (como animales/vehículos) almacenados en portal
const WebStyleSymbol = await $arcgis.import('@arcgis/core/symbols/WebStyleSymbol.js')

// Vista mapa
const arcgisMap = document.querySelector('arcgis-map')

// 1. Capa de Datos
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
})

// === 2. CREAMOS POLÍGONO DE ANÁLISIS ===
// Queremos saber qué hospitales caen dentro de este poligono
const geometriaPoligono = new Polygon({
  rings: [
    [
      // Coordenadas XY configurando un cuadro/rectángulo cerrado
      [-3.8, 40.45],
      [-3.6, 40.45],
      [-3.6, 40.38],
      [-3.8, 40.38],
      [-3.8, 40.45] // ¡¡Se repite el primero para cerrar la figura!!
    ]
  ]
})

// Simbología transparente, borde azul para ver qué hay debajo
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

// Esto lo metemos en el addEventListener 

// === 3. LA QUERY ESPACIAL ===
// estas características están en Properties del Query
const peticionHospitales = new Query({
  geometry: geometriaPoligono, // Metemos la geometría del polígono delimitador
  returnGeometry: true, // Necesitamos que nos devuelvan dónde están los puntos impactados para pintarlos
  spatialRelationship: 'intersects', // RELACIÓN ESPACIAL: Los que "toquen" o "caigan dentro" del poligono
  outFields: ['*']
})

// === 4. Hacemos y RENDERIZAMOS la CONSULTA ===

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Añadimos el recuadro para ver dónde buscamos
  arcgisMap.map.add(capaGraficaPoligono)

  // Disparamos la petición al servidor (Asíncrona, devuelve Promesa)
  // Guardamos en una const el resultado de la query
  const resultadosQueryHospitales = hospitalesFL.queryFeatures(peticionHospitales)

  // Tras resolverse la Promesa...
  resultadosQueryHospitales.then((resultadosFeatureSet) => {

    // Obtenemos los elementos que dieron positivo en la intersección
    const entidades = resultadosFeatureSet.features

    // Simbolo personalizado con "Gorilas"
    const simbologiaGorila = new WebStyleSymbol({
      name: 'Gorilla',
      styleUrl: 'https://www.arcgis.com/sharing/rest/content/items/1fbb242c54e4415d9b8e8a343ca7a9d0/data'
    })

    // Sustituimos la apariencia original con el nuevo símbolo
    const entidadesConSymbologia = entidades.map((entidadGrafico) => {
      entidadGrafico.symbol = simbologiaGorila
      return entidadGrafico
    })

    // llenamos la capa con todo y lo añadimos todo al mapa
    const capaGraficaResultado = new GraphicsLayer({
      title: 'Hospitales con Gorilas'
    })

    // Añadimos los resultados
    capaGraficaResultado.addMany(entidadesConSymbologia)

    arcgisMap.map.add(capaGraficaResultado)
  })
})
