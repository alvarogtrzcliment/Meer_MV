// Hay que hacer GEOMETRIA y SIMBOLOGÍA y una CAPA GRÁFICA de 
// un punto, polilínea y polígono --> METELAS TODAS EN UN MAPA

// Imports

// Geometrías

const Point = await $arcgis.import("@arcgis/core/geometry/Point.js");
const Polyline = await $arcgis.import("@arcgis/core/geometry/Polyline.js");
// POLYGON no hace falta, estoy usando type{} AUTOCASTING

// Simbología

const SimpleMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleMarkerSymbol.js");
const SimpleLineSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleLineSymbol.js");
const SimpleFillSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleFillSymbol.js");

// GRAPHIC y GRAPHIC LAYER

const Graphic = await $arcgis.import("@arcgis/core/Graphic.js");
const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");


// CODIGO

// Geometría Punto
const miPunto = new Point({
  latitude: 41,
  longitude: -4,

})
console.log('Geometría Punto', miPunto)

// Simbología
const simbologiaPunto = new SimpleMarkerSymbol({
  angle: 0,
  color: [194, 0, 0, 1],
  outline: {
    cap: "round",
    color: [255, 255, 255, 1],
    join: "round",
    miterLimit: 1,
    style: "solid",
    width: 1
  },
  path: "undefined",
  size: 12,
  style: "circle",
  xoffset: 0,
  yoffset: 0
});

// LAS UNO para generar un GRÁFICO para crear la CAPA GRÁFICA

const graficoPunto = new Graphic({
  geometry: miPunto,
  symbol: simbologiaPunto,
})

const capaGraficaPunto = new GraphicsLayer()

capaGraficaPunto.add(graficoPunto)

console.log('CapaPunto', capaGraficaPunto)

// Ahora lo mismo con la polilínea

const miPolilinea = new Polyline({

  paths: [[41, -3], [41, -2]]
})

// Simbología polilinea
const simbologiaPolilinea = new SimpleLineSymbol({
  cap: "round",
  color: [194, 0, 0, 1],
  join: "round",
  miterLimit: 1,
  style: "short-dash-dot-dot",
  width: 2
});

const graficoPolilinea = new Graphic({
  geometry: miPolilinea,
  symbol: simbologiaPolilinea,
})

const capaGraficaPolilinea = new GraphicsLayer()

capaGraficaPolilinea.add(graficoPolilinea)

console.log('CapaPoloilinea', capaGraficaPolilinea)

const miPoligono = {
  type: 'polygon',
  rings: [[42, -3], [42, -2], [41, -1]]
}

const simbologiaPoligono = new SimpleFillSymbol({
  // type: 'simple-fill', --> sería como se haría con autocasting
  color: [138, 0, 0, 1],
  outline: {
    cap: "round",
    color: [0, 0, 0, 1],
    join: "round",
    miterLimit: 1,
    style: "long-dash-dot-dot",
    width: 1
  },
  style: "solid"
});

const graficoPoligono = new Graphic({
  geometry: miPoligono,
  symbol: simbologiaPoligono
})

const capagraficaPoligono = new GraphicsLayer

capagraficaPoligono.add(graficoPoligono)

console.log('CapaPoligono', capagraficaPoligono)

// Añadimos las capas al mapa

const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () =>{
  arcgisMap.map.addMany([capaGraficaPolilinea, capaGraficaPunto, capagraficaPoligono])
})