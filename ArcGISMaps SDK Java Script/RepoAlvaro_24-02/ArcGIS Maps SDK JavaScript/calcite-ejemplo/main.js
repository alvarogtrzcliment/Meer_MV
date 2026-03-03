// Imports
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')

// 1. Cargamos la capa para guardar datos relacionados a hospitales
const hospitalesFL = new FeatureLayer({
  url: 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/ArcGIS/rest/services/Hospitales/FeatureServer/0'
})

// 2. Selección de Componentes --> añadimos EL BOTON
const addLayerButton = document.getElementById('add-layer')

// Mensaje en consola opcional para ver si el botón fue seleccionado correctamente
console.log(addLayerButton)

// Seleccionamos el contenedor,el mapa principal
const arcgisMap = document.querySelector('arcgis-map')

// 3. Evento de Interacción
// En el evento de clic del botón ==> "Añadir capa"
addLayerButton.addEventListener('click', () => {
  // Con el clic, cogemos la capa, y la añadimos al mapa
  arcgisMap.map.add(hospitalesFL)
})
