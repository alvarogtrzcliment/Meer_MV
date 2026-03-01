// Importaciones de módulos principales para las operaciones
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const Query = await $arcgis.import('@arcgis/core/rest/support/Query.js') // Módulo para hacer peticiones/filtros de datos
const SimpleMarkerSymbol = await $arcgis.import(
  '@arcgis/core/symbols/SimpleMarkerSymbol.js' // Módulo para definir el estilo visual de puntos
)
const GraphicsLayer = await $arcgis.import(
  '@arcgis/core/layers/GraphicsLayer.js' // Capa que soporta almacenar gráficos sin estructura estricta
)

// Seleccionamos el contenedor de mapa principal en el HTML web component
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // 1. Instanciamos la capa origen de datos (Hospitales)
  // Aunque no la mostremos directamente en el mapa (la línea de añadir está comentada abajo),
  // se utiliza su URL para ejecutar operaciones de búsqueda/consulta (Query) desde ella
  const hospitalesFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
  })

  // arcgisMap.map.add(hospitalesFL)

  // 2. Creación de una Consulta o Query SQL
  // Buscamos todos los hospitales cuya Provincia coincida con 'Segovia' O 'Ávila'
  const peticionQuery = new Query({
    where: "Provincia = 'Segovia' Or Provincia = 'Ávila'",
    returnGeometry: true, // ¡Muy importante! Pedimos que se devuelva la geometría (ubicación) para poder pintarlo en el mapa
    outFields: ['*']      // Pedimos que se traigan todos los atributos de cada registro
  })

  // 3. Ejecución de la consulta
  // ¡OJO! El método queryFeatures NO devuelve los datos al instante, devuelve una PROMESA (Promise)
  // que es asíncrona porque depende de la respuesta del servidor en internet.
  const resultadoQuery = hospitalesFL.queryFeatures(peticionQuery)

  // Resolviendo la petición asíncrona mediante el método .then()
  resultadoQuery.then((resultadoFeatureSet) => {
    // Almacenamos el listado de resultados devuelto por el servidor
    const entidades = resultadoFeatureSet.features

    console.log(entidades) // Verificamos las entidades obtenidas en consola

    // 4. Creación de simbología visual
    // Generamos un nuevo estilo para los puntos de los resultados que obtengamos
    const simbologiaPunto = new SimpleMarkerSymbol({
      angle: 0,
      color: [255, 255, 255, 0.25], // Color de relleno blanco, con 25% de opacidad (transparencia)
      outline: {
        cap: 'round',
        color: [0, 122, 194, 1], // Un recuadro o borde color azul oscuro
        join: 'round',
        miterLimit: 1,
        style: 'solid',
        width: 1 // Grosor del borde
      },
      path: 'undefined',
      size: 12, // Tamaño del punto dibujado
      style: 'circle', // Forma circular
      xoffset: 0,
      yoffset: 0
    })

    // 5. Aplicando la simbología
    // Para cada entidad devuelta en la consulta, le asignamos la simbología recién configurada
    const entidadesConSinbologia = entidades.map((grafico) => {
      grafico.symbol = simbologiaPunto
      return grafico // Retornamos el mismo gráfico con su nuevo estilo visual aplicado
    })

    // 6. Mostrando los resultados
    // Ya que nuestras "entidades" ahora son simplemente objetos "Graphic" (Geometría + Sinbología),
    // creamos una Capa Gráfica (GraphicsLayer) para dibujarlas en el mapa final
    const capaGraficaGL = new GraphicsLayer()
    capaGraficaGL.addMany(entidadesConSinbologia) // Añadimos todos los resultados procesados al mismo tiempo a la capa
    arcgisMap.map.add(capaGraficaGL)              // Finalizamos incorporando la Capa Gráfica a nuestro mapa
  })

  console.log(resultadoQuery)
})
