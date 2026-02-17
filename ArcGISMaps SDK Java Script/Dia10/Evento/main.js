// llamamos al mapa
const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
    // vista en caja
    const vistaMapa = arcgisMap.view
    // evento que cuando clicko en la vista ocurre algo, un --eventoClick--
    const eventoClickMapa = vistaMapa.on('click', (eventoClick) => {
        // cojo las coordenadas del punto que clické, y las guardo en una cosntante
        const geometriaPunto = eventoClick.mapPoint
        console.log('Geometría', geometriaPunto)
        // mueve el mapa a el punto que guardé antes (puede hacerloporque metí en la funcion que pueda ver geometrías)
        const resultadoMovimiento = vistaMapa.goTo(geometriaPunto)
        // pasa a ser una promesa porque la vista tarda en llegar al punto, y una vez llegue al punto, hará...
        console.log(resultadoMovimiento)

        //El movimiento sale bien => THEN
        resultadoMovimiento.then(() => {
            // llamas a la vistaMapa. lo que quieres hacer, y es una .... así que lleva =
            vistaMapa.zoom = 18
            // así lo 
        })

        // El movimiento sale mal => CATCH
        resultadoMovimiento.catch(() => {
console.log(error)
        })
    })
})


