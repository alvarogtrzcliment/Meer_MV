const ImageryTileLayer = await $arcgis.import("@arcgis/core/layers/ImageryTileLayer.js");
const rasterFunctionUtils = await $arcgis.import("@arcgis/core/layers/support/rasterFunctionUtils.js");
//    me lo hizo la IA
const arcgisMap = document.querySelector('arcgis-map')

// 1. Natural Color Layer (RGB)
const incendioNaturalColorITL = new ImageryTileLayer({
  portalItem: {
    id: "6f466c76fd2d4d9188ab20c62717b6ac"
  },
  bandIds: [3, 2, 0], // Red, Green, Blue bands (typical for Landsat 8)
  effect: "brightness(5) contrast(200%)",
  title: "Natural Color"
});

// 2. Define the NDVI Raster Function
// Note: Bands are 0-indexed. For Landsat 8, NIR is 4, Red is 3.
const ndviRF = rasterFunctionUtils.bandArithmeticNDVI({
  nirBandId: 4,
  redBandId: 3,
  scientificOutput: false // Usually false when applying a colormap
});

// 3. Apply a Colormap to visualize the NDVI
const colormapRF = rasterFunctionUtils.colormap({
  colorRampName: "NDVI3",
  raster: ndviRF
});

// 4. Create the NDVI Layer using the raster function
const incendioNDVI = new ImageryTileLayer({
  portalItem: {
    id: "6f466c76fd2d4d9188ab20c62717b6ac"
  },
  rasterFunction: colormapRF,
  title: "NDVI Vegetation Index",
  opacity: 0.8
});

// 5. Add layers to the map
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // You must add Layers to the map, not RasterFunctions
  arcgisMap.map.addMany([incendioNaturalColorITL, incendioNDVI]);
});