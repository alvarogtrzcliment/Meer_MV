// Imports
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
// Hacer peticiones/filtros de datos
const Query = await $arcgis.import('@arcgis/core/rest/support/Query.js')
// Estilo visual de puntos
const SimpleMarkerSymbol = await $arcgis.import('@arcgis/core/symbols/SimpleMarkerSymbol.js')
// Capa gráfica
const GraphicsLayer = await $arcgis.import('@arcgis/core/layers/GraphicsLayer.js')

// Seleccionamos el mapa
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // 1. Capa origen (Hospitales)
  // No la mostremos directamente en el mapa, usamos su URL para ejecutar Querys desde ella
  const hospitalesFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
  })

  // Añadimos la capa al mapa
  // arcgisMap.map.add(hospitalesFL) !!!!!!!

  // Para crear la query, en la documentacion del siguiente enlace, y lo cargo(copiado en los imports): 
  // https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-Query.html

  // 2. Creación de una Query SQL
  // Buscamos todos los hospitales cuya Provincia coincida con 'Segovia' O 'Ávila'
  const peticionQuery = new Query({
    where: "Provincia = 'Segovia' Or Provincia = 'Ávila'",
    returnGeometry: true, // Pedimos que devuelva la geometría (ubicación) para poder pintarlo en el mapa
    outFields: ['*']      // Que se traigan todos los atributos de cada registro
  })

  // El resultado es un feature set, POR la docum se que es un array.
  // https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-FeatureSet.html


  // 3. Ejecución de la consulta
  // ¡OJO! DEVUELVE una PROMESA, es asíncrona, depende de la respuesta del servidor en internet.
  const resultadoQuery = hospitalesFL.queryFeatures(peticionQuery)

  // Resuelve la petición con .then()
  resultadoQuery.then((resultadoFeatureSet) => {
    // Guardamos el listado de resultados
    const entidades = resultadoFeatureSet.features

    console.log(entidades) // Verificamos las entidades obtenidas en consola

    // 4. Simbología Puntos
    const simbologiaPunto = new SimpleMarkerSymbol({
      angle: 0,
      color: [255, 255, 255, 0.25], // Relleno blanco, 25% transparencia
      outline: {
        cap: 'round',
        color: [0, 122, 194, 1], // Borde azul oscuro
        join: 'round',
        miterLimit: 1,
        style: 'solid',
        width: 1 // Grosor del borde
      },
      path: 'undefined',
      size: 12, // Tamaño del punto dibujado
      style: 'circle', // Forma
      xoffset: 0,
      yoffset: 0
    })

    // 5. Aplicando la simbología
    // Para cada entidad devuelta en la consulta, le asignamos la simbología recién configurada
    const entidadesConSinbologia = entidades.map((grafico) => {
      grafico.symbol = simbologiaPunto
      return grafico // Retornamos el mismo gráfico con su nuevo estilo visual aplicado
    })

    // 6. Metemos todo a la capa y la cargamos al mapa
    // Las entidades son objetos "Graphic" (Geometría + Sinbología),
    // creamos GraphicsLayer para dibujarlas en el mapa final
    const capaGraficaGL = new GraphicsLayer()
    capaGraficaGL.addMany(entidadesConSinbologia) // Añadimos todos los resultados procesados al mismo tiempo a la capa
    arcgisMap.map.add(capaGraficaGL)              // Metemos la Capa Gráfica a nuestro mapa
  })

  console.log(resultadoQuery)
})
