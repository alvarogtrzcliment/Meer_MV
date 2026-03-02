// Imports SceneLayer, si no no podemos hacer nada en ella
// Capas 3D con elevación
const SceneLayer = await $arcgis.import("@arcgis/core/layers/SceneLayer.js");
// snowy weather
const SnowyWeather = await $arcgis.import("@arcgis/core/views/3d/environment/SnowyWeather.js");

// llamo a la escena 3D
const arcgisScene = document.querySelector("arcgis-scene")

// Hago el evento (tinene que ver cuando cagra el mapa para meter la capa)
arcgisScene.addEventListener("arcgisViewReadyChange", () => {
 // 1. Crear y cargar la SceneLayer
  const edificiosSL = new SceneLayer({
    portalItem: {
      id: "c444b24b184c4523a5dc96248bfea4e1" 
    }
  })
  // añado la capa al mapa 
  // ¡¡HAY QUE AÑADIR la escena. el mapa para que coja el mapa dentro de la escena!!
  arcgisScene.map.add(edificiosSL);
// 2. Modificar la Atmósfera 
  // Aplicamos el objeto SnowyWeather,  estamos cambiando una propiedadd, así que lleva = y nada mas
  arcgisScene.view.environment.weather = new SnowyWeather
});

// === 3. Funcionalidad del Botón de Navegación ===
// Selecciona el botón que desencadenará el viaje por el mapa
const botones = document.querySelector('.location')

// Asignamos un evento de 'clic' en el botón para cambiar el encuadre de la cámara
botones.addEventListener('click', () => {
  // .goTo()  mueve la cámara ('viaje' animado) a las coordenadas indicadas
  arcgisScene.view.goTo({
    center: [-33, 151]  // Coordenadas
  })

})


