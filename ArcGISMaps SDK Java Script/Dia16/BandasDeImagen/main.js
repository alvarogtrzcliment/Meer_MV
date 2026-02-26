const ImageryTileLayer = await $arcgis.import("@arcgis/core/layers/ImageryTileLayer.js");
const arcgisSwipe = document.querySelector("arcgis-swipe");

const arcgisMap = document.querySelector('arcgis-map')

const incendioNaturalColorITL = new ImageryTileLayer({
    portalItem: {
        id: "6f466c76fd2d4d9188ab20c62717b6ac"
    },
    bandIds: [3, 2, 0],
    effect: "brightness(5) contrast(200%)"
});
// Necesitas una segunda capa que es la misma pero con ortas bandas de color
const incendioGeologicoITL = new ImageryTileLayer({
    portalItem: {
        id: "6f466c76fd2d4d9188ab20c62717b6ac"
    },
    bandIds: [11, 10, 1],
    effect: "brightness(5) contrast(200%)"
});

console.log(incendioNaturalColorITL)
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    arcgisMap.map.addMany([incendioNaturalColorITL, incendioGeologicoITL]),
        arcgisSwipe.startLayers.add(incendioNaturalColorITL);
    arcgisSwipe.endLayers.add(incendioGeologicoITL);
})

// Botón
const botonCalcite = document.querySelector('calcite-button')

let estadoBoton = 'geo'

botonCalcite.addEventListener('click', () => {

    if (estadoBoton === 'geo') {
       incendioGeologicoITL.bandIds = [10, 7, 1]
       botonCalcite.innetHTML = 'Geológico'
       estadoBoton='agro'
    }

    else{
        incendioGeologicoITL.bandIds = [11, 10, 1]
        botonCalcite.innetHTML = 'Agricultura'
        estadoBoton='geo'
    }
})