// Imports FL y ClassBreaksRenderer
const FeatureLayer = await $arcgis.import('@arcgis/core/layers/FeatureLayer.js')
const ClassBreaksRenderer = await $arcgis.import('@arcgis/core/renderers/ClassBreaksRenderer.js')

// Web Map
const arcgisMap = document.querySelector('arcgis-map')

// 1. Capa Estaciones Meteorológicas con Renderizador Anidado
const estacionesMeteorologicasFL = new FeatureLayer({
  url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/weather_stations_010417/FeatureServer/0',
  // Instanciamos el Renderizador directamente en la PROPIEDAD 'RENDERER' ---- Para meterle la simbología a los puntos
  renderer: new ClassBreaksRenderer({
    // A. VARIABLE BASE (Temperatura)
    field: 'TEMP', // Según el campo temperatura separaremos el color/símbolo
    classBreakInfos: [
      {
        minValue: 2,   // Frío (De 2 a 32 grados F)
        maxValue: 32,
        symbol: {
          type: 'simple-marker', // Marcador básico (SVG modificado)
          path: 'M14.5,29 23.5,0 14.5,9 5.5,0z', // Definición vectorial de una flecha o dardo
          color: '#9878ff', // Color Morado-Azulado
          outline: {
            color: [0, 0, 0, 0.7],
            width: 0.5
          }
        }
      },
      {
        minValue: 33,  // Cálido (De 33 a 83 grados F)
        maxValue: 83,
        symbol: {
          type: 'simple-marker',
          path: 'M14.5,29 23.5,0 14.5,9 5.5,0z',
          color: '#ff6888', // Color Salmón/Rojizo
          outline: {
            color: [0, 0, 0, 0.7],
            width: 0.5
          }
        }
      }
    ],

    // ----- Esto debe estar fuera del classBreakInfos, así que lo minimizas antes de empezar para asegurar que se coloca bien ----
    // B. VARIABLES VISUALES SUPERPUESTAS (Tamaño y Rotación) ==> Añaden más información sin cambiar el Símbolo Base
    visualVariables: [
      {
        // Variable 1: TAMAÑO 
        type: 'size', // Indica crecimiento numérico visual
        field: 'WIND_SPEED', // Modulado por la velocidad del viento
        minDataValue: 0,   // Velocidad mínima
        maxDataValue: 60,  // Velocidad máxima
        minSize: 8,        // Velocidad 0 tamaño 8pt
        maxSize: 50        // Velocidad > 60 = 50pt
      },
      {
        // Variable 2: DIRECCIÓN flecha
        type: 'rotation', // Rotación a lo largo de un eje sobre el mapa
        field: 'WIND_DIRECT', // Dependiendo del ángulo del viento
        rotationType: 'geographic' // Modo de rotación (0 = Norte y gira horario)
      }
    ]
  })
})

// === 2. Carga al mapa ===
arcgisMap.addEventListener('arcgisViewReadyChange', () => {
  // Añadimos el componente de estaciones de tiempo al mapa
  arcgisMap.map.add(estacionesMeteorologicasFL)
})
