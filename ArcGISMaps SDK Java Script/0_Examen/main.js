// IMPORTS 
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
// Renderer
const UniqueValueRenderer = await $arcgis.import("@arcgis/core/renderers/UniqueValueRenderer.js");
// Query
const Query = await $arcgis.import("@arcgis/core/rest/support/Query.js");
// Simbology
const SimpleMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleMarkerSymbol.js");
const SimpleLineSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleLineSymbol.js");
const PictureMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/PictureMarkerSymbol.js");
// Popup
const PopupTemplate = await $arcgis.import("@arcgis/core/PopupTemplate.js");
// Graphics
const Polyline = await $arcgis.import("@arcgis/core/geometry/Polyline.js");
const Graphic = await $arcgis.import("@arcgis/core/Graphic.js");
const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");

// ==============================================================================================
//                                    CÓDIGO
// ==============================================================================================

const arcgisMap = document.querySelector('arcgis-map')

// Capa HIPERMERCADOS => Simbología por Empresa + Bloom

const hipermercadosMadridFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Comercios_de_la_Comunidad_de_Madrid_WFL1/FeatureServer/3',
  title: 'Hipermercados'
})
console.log(hipermercadosMadridFL)

const rendererHipermercados = new UniqueValueRenderer({
  field: "ETIQUETA",
  uniqueValueInfos: [
    {
      value: "Alcampo",
      symbol: new PictureMarkerSymbol({
        url: "./Alcampo-Logo.png",
        width: "24px",
        height: "24px"
      })
    },
    {
      value: "Carrefour",
      symbol: new PictureMarkerSymbol({
        url: "./Carrefour-Logo.png",
        width: "30px",
        height: "20px"
      })
    },
    {
      value: "Hipercor",
      symbol: new PictureMarkerSymbol({
        url: "./Hipercor_Logo.png",
        width: "40px",
        height: "24px"
      })
    },
    {
      value: "E.Leclerc",
      symbol: new PictureMarkerSymbol({
        url: "./leclerc-logo.png",
        width: "24px",
        height: "24px"
      })
    },
    {
      value: "Costco",
      symbol: new PictureMarkerSymbol({
        url: "./Costco-Logo.png",
        width: "40px",
        height: "24px"
      })
    },
  ]
});

hipermercadosMadridFL.renderer = rendererHipermercados;
hipermercadosMadridFL.effect = 'bloom(0.8, 0.5px, 0.1)';


// ==============================================================================================

// Capa MERCADOS => POPUP (nombre dirección municipio)

const comerciosMadridPopup = new PopupTemplate({
  title: '{BUSCA}',
  content: [
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'DIRECCION',
          label: 'Dirección'
        },
        {
          fieldName: 'MUNICIPIO',
          label: 'Municipio'
        }
      ]
    }
  ]
})
const mercadosMadridFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Comercios_de_la_Comunidad_de_Madrid_WFL1/FeatureServer/5',
  title: 'Mercados',
  renderer: {
    type: "simple",
    symbol: new PictureMarkerSymbol({
      url: "./bolsa_png.png",
      width: "22px",
      height: "22px"
    })
  },
  popupTemplate: comerciosMadridPopup
})
console.log(mercadosMadridFL)


// ==============================================================================================

// Capa MERCADILLOS => query de mercadillos dentro del MUNICIPIO  madrid
const mercadillosMadridFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Comercios_de_la_Comunidad_de_Madrid_WFL1/FeatureServer/4'
})
console.log(mercadillosMadridFL)

const peticionQuery = new Query({
  where: "MUNICIPIO = 'Madrid'",
  returnGeometry: true,
  outFields: ['*']
})

const simbologiaPunto = new SimpleMarkerSymbol({
  style: "diamond",
  size: 12,
  angle: 0,
  color: "#00ffd0ff",
  outline: {
    color: "#ffffffff",
    width: 1
  },
})

const mercadillosMadridGL = new GraphicsLayer({
  title: 'Mercadillos',
  renderer: {
    type: "simple",
    symbol: simbologiaPunto
  }
})

const resultadoQuery = mercadillosMadridFL.queryFeatures(peticionQuery)

resultadoQuery.then((resultadoFeatureSet) => {
  const entidadesMercadillos = resultadoFeatureSet.features

  console.log(entidadesMercadillos)

  const entidadesMercadillosConSinbologia = entidadesMercadillos.map((grafico) => {
    grafico.symbol = simbologiaPunto
    return grafico
  })

  mercadillosMadridGL.addMany(entidadesMercadillosConSinbologia)
})

console.log(resultadoQuery)


// ==============================================================================================
// FUNCIONALIDAD CLICK


const puntoClikadoGL = new GraphicsLayer({
  title: "Capa que guarda el punto clicado",
})

const lineasMercadosGL = new GraphicsLayer({
  title: "Capa de líneas a los Mercados",
  effect: "bloom(0.8, 0.5px, 0.1)"
})


const simbologiaLinea = new SimpleLineSymbol({
  color: 'orange',
  width: 2
})

// Simbología para el punto donde se hace click
const simbologiaClick = new SimpleMarkerSymbol({
  color: "white",
  style: "diamond",
  effect: "bloom(0.8, 0.5px, 0.1)",
  size: 10,
  outline: { color: "orange", width: 2 }
})

arcgisMap.addEventListener('arcgisViewClick', (event) => {
  const puntoMapa = event.detail.mapPoint;

  puntoClikadoGL.removeAll();
  lineasMercadosGL.removeAll();

  const graficoClick = new Graphic({
    geometry: puntoMapa,
    symbol: simbologiaClick
  })
  puntoClikadoGL.add(graficoClick)

  const queryEspacial = new Query({
    geometry: puntoMapa,
    distance: 2,
    units: "kilometers",
    spatialRelationship: "intersects",
    returnGeometry: true,
    outFields: ["*"]
  })

  mercadosMadridFL.queryFeatures(queryEspacial).then((resultado) => {
    const mercadosCercanos = resultado.features;

    mercadosCercanos.forEach((mercado) => {
      const linea = new Polyline({
        paths: [
          [puntoMapa.x, puntoMapa.y],
          [mercado.geometry.x, mercado.geometry.y]
        ],
        spatialReference: puntoMapa.spatialReference
      });

      const graficoLinea = new Graphic({
        geometry: linea,
        symbol: simbologiaLinea
      });

      lineasMercadosGL.add(graficoLinea);
    });
  });
});

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  arcgisMap.map.addMany([
    mercadosMadridFL,
    hipermercadosMadridFL,
    mercadillosMadridGL,
    lineasMercadosGL,
    puntoClikadoGL
  ])
})