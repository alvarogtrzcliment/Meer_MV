const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Guardamos la "vista" del mapa en una variable (const))
  // View encargada de gestionar los eventos e interacción del usuario
  const vistaMapa = arcgisMap.view

  // 1. Escuchar Eventos del usuario sobre el Mapa
  // !!! El método 'on' nos permite reaccionar a la interacción, en este caso 'click'
  const eventoClickMapa = vistaMapa.on('click', (eventoClick) => {

    // Se guardan las coordenadas del evento Click.mapPoint)
    const geometriaPunto = eventoClick.mapPoint
    console.log('Geometria', geometriaPunto)

    // 2. Movimiento de Cámara (goTo)
    // Mandamos la vista a re-centrarse donde hicimos click. (devuelve la promesa)
    const resultadoMovimiento = vistaMapa.goTo(geometriaPunto)
    // promesa informa de si se completó con éxito o falló.
    console.log(resultadoMovimiento)

    // A. El movimiento finaliza con éxito (then)
    resultadoMovimiento.then(() => {
      // Una vez terminado el centrado, damos zoom 18
      vistaMapa.zoom = 18
    })

    // B. El movimiento fracasa (catch)
    // Ocurre por ejemplo si el usuario hace otro click o arrastra mientras la cámara aún viaja
    resultadoMovimiento.catch((error) => {
      console.log(error) // Registramos el porqué del error/interrupción en consola
    })
  })
})
