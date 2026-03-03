// === 1. ESTRUCTURA TEÓRICA DE UNA PROMESA ===

// Se instancia el objeto Promise
// const promesa = new Promise()

// A. Si se resuelve con éxito:
// Ejecuta la función callback dentro del .then()
// promesa.then((respuesta)=>{
//   Cosas que hacer cuando va bien...
// })

// B. Si existe un fallo (ej: no hay internet, error de servidor):
// Se captura internamente y ejectuta la función del .catch()
// promesa.catch((error)=>{
//   Cosas que hacer para manejar el error...
// })


// === 2. EJEMPLO PRÁCTICO ===

// Hacer una petición asíncrona a la API de chistes de Chuck Norris
// fetch() devuelve nativamente una Promesa
const llamadaChuckNorris = fetch('https://api.chucknorris.io/jokes/random')

// 'llamadaChuckNorris' se queda "esperando" la descarga (pueden ser milisegundos o segundos)

// Procesando el éxito de la petición
llamadaChuckNorris.then((respuesta) => {
  // Cuando se termine de bajar la información, la parseamos a formato JSON e imprimimos
  console.log(respuesta.json())
})

// Procesando el fracaso
llamadaChuckNorris.catch((error) => {
  // Si la página falla, veremos el porqué
  console.log(error)
})

// === 3. ALTERNATIVA MODERNA ===
// La misma lógica de las Promesas se puede hacer con la sintaxis 'async / await'
async function llamarAChuckNorris() {
  // Código asíncrono aquí dentro
}
