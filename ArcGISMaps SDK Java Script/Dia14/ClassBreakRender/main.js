// Imports FC y ClassBreaksRenderer
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
// == ClassBreaksRenderer: colorea polígonos o puntos según rangos numéricos.
const ClassBreaksRenderer = await $arcgis.import("@arcgis/core/renderers/ClassBreaksRenderer.js");

// Seleccionamos el web map
const arcgisMap = document.querySelector('arcgis-map')

// 1. Configuramos el Renderizador, asocia el campo numérico que determinará la simbología ('F_POBLACION__Población')
const zonasSaludClassBreakRenderer = new ClassBreaksRenderer({
    field: "F_POBLACION__Población ",
    
// 2. Definimos Rangos y Simbología
// Rango 1: Población de 0 a 10.000 habitantes (Claro)
    classBreakInfos: [
    // !!! Debes meter cada cosa del arrray en un objeto {}
        {
            minValue: 0,
            maxValue: 10000,
            symbol: {
                type: "simple-fill", // Relleno simple para polígonos
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

// =========================================================================================================
//  Forma 2 de hacerlo: usando el MÉTODO .addClassBreaksInfo, tienes que meterle el nombre del renderer bien 
// =========================================================================================================

// Rango 2: Población de 10.000 a 30.000 habitantes (Morado)
zonasSaludClassBreakRenderer.addClassBreakInfo({
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
// Rango 3: Población de 30.000 a 74.000 habitantes (Oscuro)
zonasSaludClassBreakRenderer.addClassBreakInfo({
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

// 3. Creamos la capa y aplicamos el Renderizador(Zonas Básicas de Salud en la Comunidad de Madrid)
const zonasSaludFL = new FeatureLayer({
    url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/ZONAS_BASICAS_SALUD_MADRID/FeatureServer/0',
    renderer: zonasSaludClassBreakRenderer // Asignamos el estilo basado en clases creado previamente
})

// 4.  Añadimos la simbolgía al mapa cuando esté listo

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.add(zonasSaludFL)
})