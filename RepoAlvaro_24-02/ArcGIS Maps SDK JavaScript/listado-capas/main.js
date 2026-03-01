// Seleccionamos el web component que encapsula el mapa
const arcgisMap = document.querySelector('arcgis-map')

// Escuchamos a que el mapa termine de renderizarse en el navegador
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // 1. Extraer listado de Capas
  // 'allLayers.items' devuelve un array o colección con todas las capas presentes en ese momento en el objeto Map
  const capas = arcgisMap.map.allLayers.items

  console.log(arcgisMap.map) // Verificamos la estructura general del mapa en consola

  // 2. Creación de la Interfaz UI vía DOM manual
  // Creamos desde cero un contenedor <div> para listar el nombre de estas capas
  const div = document.createElement('div')
  div.id = 'div-capas' // Asignamos un identicador único si quisiéramos darle estilo por CSS

  // Recorremos la colección de capas una por una
  for (let capa of capas) {
    const parrafo = document.createElement('p') // Creamos una nueva etiqueta de párrafo (<p>)
    parrafo.innerText = capa.title // Rellenamos el texto con la propiedad 'title' (título) que tiene la capa en ArcGIS

    // Inyectamos este párrafo dentro de nuestro contenedor 'div'
    div.appendChild(parrafo)
  }

  // 3. Montar la UI en pantalla
  // Finalmente inyectamos todo nuestro 'div' contenedor dentro del cuerpo (body) de la página web
  document.body.appendChild(div)
})
