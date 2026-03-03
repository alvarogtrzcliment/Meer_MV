// Importaciones para entorno 3D
const SceneLayer = await $arcgis.import('@arcgis/core/layers/SceneLayer.js') // Capas 3D con elevación y modelado
const SnowyWeather = await $arcgis.import(
  '@arcgis/core/views/3d/environment/SnowyWeather.js' // Efecto climático en 3D (Nieve)
)

// Seleccionar el web component específico para escenas 3D ('arcgis-scene', no 'arcgis-map')
const arcgisScene = document.querySelector('arcgis-scene')

arcgisScene.addEventListener('arcgisViewReadyChange', () => {
  // 1. Cargar una Capa de Escena (SceneLayer)
  // Utilizamos el ID de un elemento del Portal Arcade (edificios 3D de San Francisco, etc.)
  const edificiosSL = new SceneLayer({
    portalItem: {
      id: 'c444b24b184c4523a5dc96248bfea4e1'
    }
  })

  // Añadir al mapa 3D
  arcgisScene.map.add(edificiosSL)

  // 2. Modificar el Entorno o Atmósfera (Atmospheric environment)
  // Aplicamos el objeto SnowyWeather a las propiedades del clima de la vista actual
  arcgisScene.view.environment.weather = new SnowyWeather()
})

// === 3. Funcionalidad del Botón de Navegación ===
// Selecciona en el DOM el botón que desencadenará el viaje por el mapa
const botonViaje = document.querySelector('.boton-viaje')

// Asignamos un evento de 'clic' en el botón para cambiar el encuadre de la cámara
botonViaje.addEventListener('click', () => {
  // .goTo() es un método asíncrono que mueve la cámara ('viaje' animado) a las coordenadas indicadas
  arcgisScene.view.goTo({
    center: [-126, 49] // Longitud, Latitud destino
  })
})
