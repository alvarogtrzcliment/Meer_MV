// Seleccionamos el mapa
const arcgisMap = document.querySelector('arcgis-map')

// Event listener a que se renderice
arcgisMap.addEventListener('arcgisViewReadyChange', () => {   //( => {}) Es una función flecha, dentro de la que vamos a programar
  // 1. Extraer listado de Capas
  // 'allLayers.items' devuelve un array con todas las capas presentes en el mapa
  const capas = arcgisMap.map.allLayers.items
  // capas es un array de capas

  console.log(arcgisMap.map.allLayers.items[0].title)
  // en la consola de la web miras en el contenido, AllLayers, items [3] hay 3 capas, lo abres, vas a cada capa 
  // y en title está el título en layers no te cuenta el mapa base. Con el property path coges el 
  // camino para meterlo aquí en VS

  console.log(arcgisMap.map) // Verificamos la estructura general del mapa en consola

  // 2. Iteramos con for of. También se puede hacer con capas.map() o capas.forEach()
  // Creamos un <div> para que el Iterador liste los nombres de las capas
  const div = document.createElement('div')
  div.id = 'div-capas' // Asignamos un id

  // Recorremos las capas una por una
  for (let capa of capas) {
    const parrafo = document.createElement('p') // Creamos una nueva etiqueta de párrafo (<p>)
    parrafo.innerText = capa.title // Ponemos el título de la capa en ArcGIS
    // Lo metemos en el 'div'
    div.appendChild(parrafo)
  }

  // 3. Montarlo en pantalla
  // Finalmente inyectamos el 'div' en el cuerpo de la web
  document.body.appendChild(div)
})
