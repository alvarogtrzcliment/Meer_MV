const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js');
// no hace falta importar el renderer porque ya está puesto en el hosputalesFL.renderer
// const HeatmapRenderer = await $arcgis.import("@arcgis/core/renderers/HeatmapRenderer.js");

const arcgisMap = document.querySelector('arcgis-map')
const hospitalesFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
})

hospitalesFL.renderer = {
  type: "heatmap",
  colorStops: [
    { ratio: 0, color: "rgba(255, 255, 255, 0)" },
    { ratio: 0.2, color: "rgb(255, 208, 169)" },
    { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
    { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
    { ratio: 1, color: "rgba(255, 0, 0, 1)" }
  ],
    minDensity: 0,
  maxDensity: 0.1,
  radius: 10
};


arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(hospitalesFL)
})