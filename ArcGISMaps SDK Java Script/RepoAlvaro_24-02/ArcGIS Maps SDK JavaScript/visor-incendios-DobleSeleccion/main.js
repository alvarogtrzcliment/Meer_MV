// Imports
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const Query = await $arcgis.import('@arcgis/core/rest/support/Query.js') // Consultas de datos
const PictureMarkerSymbol = await $arcgis.import('@arcgis/core/symbols/PictureMarkerSymbol.js') // Símbolos basados en imágenes (ej. íconos png/jpg)
const GraphicsLayer = await $arcgis.import('@arcgis/core/layers/GraphicsLayer.js') // Capa para dibujar gráficos libres

// Selecciona el mapa
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // 1. Capa origen ==PAÍSES DEL MUNDO==
  const paisesFL = new FeatureLayer({
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries/FeatureServer/0'
  })

  // Capa origen ==FOCOS DE INCENDIO== (Detección Termal satélite MODIS) no se ve porque no las añadimos al mapa
  const incendiosFL = new FeatureLayer({
    url: 'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/MODIS_Thermal_v1/FeatureServer/1'
  })

  // 2. Capa Intermedia ==CAPA DE INCENDIOS== pinta solo los incendios encontrados con nuestras condiciones
  const capaIncendiosGL = new GraphicsLayer({
    title: 'Incendios'
  })

  // 3. Simbología INCENDIOS == Metemos una imagen (ícono de fuego) como símbolo
  // !! Se hace fuera del .then() para que no se repita
  const simbologiaIncendio = new PictureMarkerSymbol({
    height: 32,
    url: 'https://cdn-icons-png.flaticon.com/512/1172/1172477.png?w=740&t=st=1686904179~exp=1686904779~hmac=88debfe6e746b67f6d5ea14f8b3de9cda0bb4863f2853270d04519720ffda663',
    width: 32
  })

  // === 4. QUERY #1 : Aislar el país destino ===

  // Petición SQL buscando España por su código ISO
  const peticionEspana = new Query({
    // where es lo más importante porque es lo que coge el atributo y su tipo
    where: "ISO_CC = 'ESP'",
    // pido que me devuelva la geometría porque es lo que busco, la forma de españa
    returnGeometry: true // Fundamental para usar la forma luego
  })

  // Ejecutamos la búsqueda (Promesa) en la capa de Países -- Metes en una constante el resultado de la query
  const resultadoEspana = paisesFL.queryFeatures(peticionEspana)

  resultadoEspana.then((resultadoFeatureSet) => {
    // Tomamos el Array de polígonos que compone España
    const poligonosEspana = resultadoFeatureSet.features

    // Iteramos para coger el Array de polígonos que compone españa
    poligonosEspana.map((poligono) => {
      // Guardamos el polígono de España en una constante
      const geometriaPoligono = poligono.geometry // TODO LO QUE PONGAS AQUÍ SE REPITE N VECES

      // === 5. QUERY #2: Filtrado Espacial de Incendios ===

      // Con el polígono extraído,vemos que Incendios estan en España.
      const incendiosQuery = new Query({
        geometry: geometriaPoligono,
        returnGeometry: true,
        spatialRelationship: 'intersects' // Relación espacial ("Toca o corta")
      })


      // ==========TE QUEDASTE AQUÍ============


      // Llamamos a la capa de incendios, para hacer la sub-búsqueda
      const resultadoQueryIncendios = incendiosFL.queryFeatures(incendiosQuery)

      resultadoQueryIncendios.then((resultadoFeatureSetIncendios) => {
        // Obtenemos los fuegos reales en España
        const incendios = resultadoFeatureSetIncendios.features

        // Aplicamos el ícono a cada uno, también fuera para que no se repita
        const incendiosConSimbologia = incendios.map((incendioGraphic) => {
          incendioGraphic.symbol = simbologiaIncendio
          return incendioGraphic
        })

        // Agregamos todos los fuegos detectados en la Capa Gráfica
        capaIncendiosGL.addMany(incendiosConSimbologia)
      })
    })

    // Metemos la capa pintada en el Mapa
    arcgisMap.map.add(capaIncendiosGL)
  })
})
