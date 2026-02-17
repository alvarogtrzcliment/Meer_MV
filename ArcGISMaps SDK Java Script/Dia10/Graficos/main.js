// Imports (Core API -> Geometry -> Point)
const Point = await $arcgis.import("@arcgis/core/geometry/Point.js");
// del constructor de simbología
const SimpleMarkerSymbol = await $arcgis.import("@arcgis/core/symbols/SimpleMarkerSymbol.js");
// other popular graphics en core API abajo
const Graphic = await $arcgis.import("@arcgis/core/Graphic.js");
// Layers "especiales" graphics en core API abajo
const GraphicsLayer = await $arcgis.import("@arcgis/core/layers/GraphicsLayer.js");

// añadir puntos al mapa

// #1 Crear la geometría (varias maneras de obtenerlas) map point, de la api, con codigo a lo bruto
const geometriaPunto =  new Point({
    latitude: -4,
    longitude: 41.4
}) 

console.log('Geometría',geometriaPunto)

// Simbología hecho en https://developers.arcgis.com/javascript/latest/visualization/symbols-color-ramps/symbol-builder/

const simbologiaPunto = new SimpleMarkerSymbol({
  angle: 0,
  color: [241,133,255,1],
  outline: {
    cap: "round",
    color: [92,3,181,1],
    join: "round",
    miterLimit: 1,
    style: "solid",
    width: 1
  },
  path: "undefined",
  size: 12,
  style: "triangle",
  xoffset: 0,
  yoffset: 0
});

// Tienes la geometría y Simbología, ahora las UNES

const graficoPunto = new Graphic({
    geometry:geometriaPunto,
    symbol:simbologiaPunto,
    // ya estan la geometría y la simbología, ahora podemos usarlo
})

// creo una capa grafica para los graficos que creo

const capaGraficaGL = new GraphicsLayer()

capaGraficaGL.add(graficoPunto)

// hay que añadir la capa grafica al mapa

const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange',()=>{
    arcgisMap.map.add(capaGraficaGL)
})