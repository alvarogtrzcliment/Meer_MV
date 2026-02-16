// importo la Escena, clase scene layer, si no no podemos hacer nada en ella
const SceneLayer = await $arcgis.import("@arcgis/core/layers/SceneLayer.js");

// snowy weather
const SnowyWeather = await $arcgis.import("@arcgis/core/views/3d/environment/SnowyWeather.js");

// llamo a la escena con const
const arcgisScene = document.querySelector("arcgis-scene")

// Hago el evento (tinene que ver cuando cagea el mapa para meter la capa)
arcgisScene.addEventListener("arcgisViewReadyChange", () => {
  // creo la escena
  const edificiosSL = new SceneLayer({
    portalItem: {
      id: "c444b24b184c4523a5dc96248bfea4e1"
    }
  })
  // añado la capa al mapa 
  // ¡¡HAY QUE AÑADIR la escena. el mapa para que coja el mapa dentro de la escena!!
  arcgisScene.map.add(edificiosSL);

  // estamos cambiando una propiedadd, así qeu lleva = y nada mas
  arcgisScene.view.environment.weather = new SnowyWeather
});

const botones = document.querySelector('.location')

botones.addEventListener('click', () => {
  // go to a point using center, zoom, tilt, and heading
  arcgisScene.view.goTo({
    center: [-33, 151]
  })

})


