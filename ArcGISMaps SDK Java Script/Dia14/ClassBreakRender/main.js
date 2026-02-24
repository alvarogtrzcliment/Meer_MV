const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const ClassBreaksRenderer = await $arcgis.import("@arcgis/core/renderers/ClassBreaksRenderer.js");

const arcgisMap = document.querySelector('arcgis-map')

const zonasAludClassBreakRenderer = new ClassBreaksRenderer({
    field: "F_POBLACION__Población ",
    // All features with magnitude between 0 - 10000 --- Forma 1 de hacerlo, dentro del classRenderer
    classBreakInfos: [
// ======================================================================
        // !!! tienes que meter cada cosa del arrray en un objeto {} ====
// ======================================================================
        {
            minValue: 0,
            maxValue: 10000,
            symbol: {
                type: "simple-fill",
                color: "#b57fee",
                style: "solid",
                outline: {
                    width: 0.2,
                    color: [255, 255, 255, 0.5],
                },
            }
        },
    ],
});

// All features with magnitude between 1000 - 30000 ----- Forma 2 de hacerlo
// ===================================================================================================
// === Estas usando el MÉTODO .addClassBreaksInfo, tienes que meterle el nombre del renderer bien ====
// ===================================================================================================
zonasAludClassBreakRenderer.addClassBreakInfo({
    minValue: 10001,
    maxValue: 30000,
    symbol: {
        type: "simple-fill",
        color: "#7041a5",
        style: "solid",
        outline: {
            width: 0.2,
            color: [255, 255, 255, 0.5],
        },
    }
});
// All features with magnitude between 3000 - infinito
zonasAludClassBreakRenderer.addClassBreakInfo({
    minValue: 30001,
    maxValue: 74000,
    symbol: {
        type: "simple-fill",
        color: "#30184b",
        style: "solid",
        outline: {
            width: 0.2,
            color: [255, 255, 255, 0.5],
        },
    }
});

const zonasAludFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/ZONAS_BASICAS_SALUD_MADRID/FeatureServer/0',
    renderer: zonasAludClassBreakRenderer
})

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(zonasAludFL)
})