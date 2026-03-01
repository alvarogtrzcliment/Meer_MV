const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')

//Se crea la capa vacía (la instancia)
const redNaturaFL = new FeatureLayer()

// 1. Asignación de las propiedades con notación de punto (.)
redNaturaFL.url = 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Red_Natura_2000/FeatureServer'

// 2. Definir Renderizador Unique-Value (AUTOCASTING)
// Indicamos al sistema que pinte los polígonos de un color diferente 
// según exclusivamente la coincidencia del campo ('TIPO_NUEVO').
redNaturaFL.renderer = {
  type: 'unique-value',
  field: 'TIPO_NUEVO',  // El campo estricto que se mirará
  uniqueValueInfos: [
    // Opción 1: LIC
    {
      value: 'LIC', // Si el campo es literalmente 'LIC' -> Relleno verde
      symbol: {
        type: 'simple-fill',
        color: 'green'
      }
    },
    // Opción 2:ZEPA
    {
      value: 'ZEPA', // Si el campo es literalmente 'ZEPA' -> Relleno rojo
      symbol: {
        type: 'simple-fill',
        color: 'red'
      }
    },
    // Opción 3: LIC/ZEPA
    {
      value: 'LIC/ZEPA', // Si el campo es literalmente 'LIC/ZEPA' -> Relleno amarillo
      symbol: {
        type: 'simple-fill',
        color: 'yellow'
      }
    }
  ]
}

const arcgisMap = document.querySelector('arcgis-map')

arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Se inyecta la capa coloreada categóricamente al mapa
  arcgisMap.map.add(redNaturaFL)
})
