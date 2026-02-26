const ImageryTileLayer = await $arcgis.import("@arcgis/core/layers/ImageryTileLayer.js");
const { bandArithmeticNDVI, colormap } = await $arcgis.import("@arcgis/core/layers/support/rasterFunctionUtils.js"); const ImageryTileLayer = await $arcgis.import("@arcgis/core/layers/ImageryTileLayer.js");



const arcgisMap = document.querySelector('arcgis-map');


// Create an NDVI raster function with output scaled to 0–255.
const ndviRF = bandArithmeticNDVI{
    
    functionArguments: {
        visibleBandIS: 3,
        infraredBandID: 4,
        scientificOutput: false, // True outputs values from -1 to 1.
    }
};
// Apply a predefined color map to the NDVI raster function result.
const rasterFunction = {
    functionName: "Colormap",
    functionArguments: {
        colorRampName: "NDVI3",
        raster: ndviRasterFunction
    }
};

// Cargas la capa
const incendioNaturalColorITL = new ImageryTileLayer({
    portalItem: {
        id: "6f466c76fd2d4d9188ab20c62717b6ac"
    },
    rasterFunction: rasterFunction
});
// Lo añades al mapa
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add([incendioNaturalColorITL]);
});