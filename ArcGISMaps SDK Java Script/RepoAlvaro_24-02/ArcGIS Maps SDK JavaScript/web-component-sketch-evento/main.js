// === 1. IMPORTS ===
const GraphicsLayer = await $arcgis.import('@arcgis/core/layers/GraphicsLayer.js')
const Query = await $arcgis.import('@arcgis/core/rest/support/Query.js')
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const SimpleMarkerSymbol = await $arcgis.import('@arcgis/core/symbols/SimpleMarkerSymbol.js')

// === 2. SELECCIÓN DE COMPONENTES DEL HTML ===
const arcgisMap = document.querySelector('arcgis-map')
const sketch = document.querySelector('arcgis-sketch') // Panel de dibujo libre

// Cargamos la capa
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
})

// === 3. CAPAS GRÁFICAS VIRTUALES ===
// Esta alojará los trazos creados por el usuario con el widget sketch
const capaGraficaResultados = new GraphicsLayer()
// Esta alojará dinámicamente los hospitales que cumplieron la consulta formulada
const capaGraficaHospitalesResultados = new GraphicsLayer()

// Estilo para resaltar los hospitales afectados
const simbologiaPunto = new SimpleMarkerSymbol({
  angle: 0,
  color: [0, 255, 145, 1],
  outline: {
    cap: 'round',
    color: [0, 122, 194, 1],
    join: 'round',
    miterLimit: 1,
    style: 'solid',
    width: 1
  },
  path: 'undefined',
  size: 12,
  style: 'circle',
  xoffset: 0,
  yoffset: 0
})

// === 4. INICIALIZACIÓN DEL WIDGET DE SKETCH ===
// Al cargar el panel de dibujo, le decimos dónde guardar lo dibujado
sketch.addEventListener('arcgisReady', () => {
  sketch.layer = capaGraficaResultados
})

// === 5. ESCUCHAR EL EVENTO DE CREACIÓN DE TRAZADO (DIBUJO) ===
// 'arcgisCreate' salta continuamente mientras dibujamos (inicio, moviendo, y fin)
sketch.addEventListener('arcgisCreate', (customEvent) => {
  console.log(customEvent)

  // A. Solo ejecutamos análisis de datos si...
  if (
    customEvent.detail.state === 'complete' && // El usuario ha terminado el trazo levantando el dedo/ratón
    customEvent.detail.tool === 'point'        // La herramienta elegida para el dibujo era un Punto suelto.
  ) {

    // B. Preparación y Captura
    // Limpiamos los resultados de consultas o clicks previos
    capaGraficaHospitalesResultados.removeAll()

    // Extraemos la Coordenada final del clic pintado
    const geometriaPunto = customEvent.detail.graphic.geometry
    console.log(geometriaPunto)

    // C. Configuración Estricta de la Consulta o Buffer Radial
    const parametrosQuery = new Query({
      geometry: geometriaPunto, // El centro o ancla de nuestra consulta será el pinchazo del usuario
      spatialRelationship: 'intersects',
      distance: 10,        // BEMOS AÑADIDO MAGIA: Distancia radial de análisis
      units: 'kilometers', // Medida (En base creamos un tampón o buffer invisible de 10km alrededor de nuestro click!)
      returnGeometry: true,
      outFields: ['*']
    })

    // D. Petición al servidor (Asíncrona) sobre la capa original que cruzamos (Hospitales)
    const resultadoQuery = hospitalesFL.queryFeatures(parametrosQuery)

    // ESTO ES UNA PROMESA!!!!!!

    resultadoQuery.then((resultadoFeatureSet) => {
      // Entidades o Puntos que cayeron en ese radio de 10 kms a la redonda
      const entidades = resultadoFeatureSet.features

      // Les aplicamos nuestro diseño en verde brillante (simbologiaPunto)
      const entidadesConSimbologia = entidades.map((hospital) => {
        hospital.symbol = simbologiaPunto
        return hospital
      })

      // Agregamos juntas las entidades coloreadas a la capa intermedia de resultados.
      capaGraficaHospitalesResultados.addMany(entidadesConSimbologia)
    })
  }
})

// === 6. VÍNCULO FINAL AL MAPA ===
// Enganchamos estas capas interactivas a nuestro lienzo cartográfico maestro
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.add(capaGraficaResultados)
  arcgisMap.map.add(capaGraficaHospitalesResultados)
})
