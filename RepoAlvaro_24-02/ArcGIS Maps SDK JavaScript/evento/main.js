const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Extraemos y guardamos la "vista" del mapa en una variable local
  // La Vista (View) es la encargada de gestionar los eventos e interacción del usuario
  const vistaMapa = arcgisMap.view

  // 1. Escuchar Eventos del usuario sobre el Mapa
  // El método 'on' nos permite reaccionar a la interacción, en este caso 'click'
  const eventoClickMapa = vistaMapa.on('click', (eventoClick) => {

    // Obtenemos del evento Click el punto geométrico donde se pulsó (mapPoint)
    const geometriaPunto = eventoClick.mapPoint
    console.log('Geometria', geometriaPunto)

    // 2. Transición o Movimiento de Cámara (goTo)
    // Ordenamos a la vista re-centrarse en el punto donde hicimos click.
    // Esto devuelve una Promesa (Promise) que nos informará si se completó con éxito o falló.
    const resultadoMovimiento = vistaMapa.goTo(geometriaPunto)
    console.log(resultadoMovimiento)

    // A. El movimiento finaliza con éxito (then)
    resultadoMovimiento.then(() => {
      // Una vez terminado el centrado exitosamente, aplicamos un nivel de zoom más detallado (18)
      vistaMapa.zoom = 18
    })

    // B. El movimiento fracasa o es interrumpido (catch)
    // Ocurre por ejemplo si el usuario hace otro click o arrastra mientras la cámara aún viaja
    resultadoMovimiento.catch((error) => {
      console.log(error) // Registramos el porqué del error/interrupción en consola
    })
  })
})
