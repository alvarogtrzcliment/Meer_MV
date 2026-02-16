
const arcgisMap = document.querySelector("arcgis-map")

arcgisMap.addEventListener("arcgisViewReadyChange", () => {
    // , => {} Es una función flecha, dentro de la que vamos a programar
    console.log(arcgisMap.map.allLayers.items[0].title)
    // en la consola de la web miras en el contenido, AllLayers, items [3] hay 3 capas, lo abres, vas a cada capa y en title está el título
    // en layers no te cuenta el mapa base. Con el property path coges el camino para meterlo aquí en VS

    const capas = arcgisMap.map.allLayers.items
    // capas es un array de capas
    // capas.map()es un iterador, también lo puedes hacer con un for of
    for (let capa of capas) {
        console.log(capa.title)
        // iterador que imprime los títulos de las capas

        // para hacer   que el iterador ponga los nombres de las capas en un div y lo incluya en el mapa
        const div = document.createElement('div')
        div.id = 'div-capas'
        // has creado el div y lo has nombrado

        for (let capa of capas) {
            const parrafo = document.createElament('p')
            parrafo.innetText = capa.title
            div.appendChild(parrafo)
        }
    }
    // tienes que llamarlo para que aparezca en la web como tal
    document.body.appendChild(div)

})
