// Lo primero que hay que hacer es llamar al elemento arcgisMap, cuya etiqueta es 'arcgis-mao' (eneste caso)
// este elemento contiene tanto el map como el view!!
const arcgisMap = document.querySelector('arcgis-map')
const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");


arcgisMap.addEventListener('arcgisViewReadyChange', (eventoViewReadyChange)=>{
    
    // este evento se ejecuta cuando se carga la vista del mapa o  cambiemos el mapa
    
    // creamos la capa
    const hospitalesFL = new FeatureLayer({
        url:'https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Hospitales/FeatureServer'
    })

    arcgisMap.map.add(hospitalesFL)
    
})
