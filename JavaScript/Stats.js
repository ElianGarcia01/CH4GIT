import * as modulo from '../Modules/Modules.js'

// IMPORTAR INFORMACION DE LA API
modulo.obtenerDatos()
    .then(datos => {
        let data = datos
        let eventos = data.events

        // Filtro de eventos futuros y pasados
        let eventosFuturos = eventos.filter(evento => evento.date > data.currentDate)
        let eventosPasados = eventos.filter(evento => evento.date < data.currentDate)

        // TABLA EVENTS ESTATISTICS % OF ASSISTANCE

        // ENCONTRAR EL EVENTO CON EL MAYOR PORCENTAJE DE ASISTENCIA
        let maxPorcentajeAsistencia = 0
        let eventoMaxAsistencia = null

        eventos.forEach(evento => {

            // Verificar que asistencia y capacidad no sean indefinidas
            if (evento.assistance !== undefined && evento.capacity !== undefined) {
                // Obtener porcentaje de asistencia
                let porcentajeAsistencia = (evento.assistance / evento.capacity) * 100

                // Buscar el elemento de mayor porcentaje de asistencia
                if (porcentajeAsistencia > maxPorcentajeAsistencia) {
                    maxPorcentajeAsistencia = porcentajeAsistencia
                    eventoMaxAsistencia = evento
                }
            }
        })

        // ENCONTRAR EL EVENTO CON MENOR PORCENTAJE DE ASISTENCIA
        let minPorcentajeAsistencia = 100
        let eventoMinAsistencia = null

        eventos.forEach(evento => {
            // Verificar que asistencia y capacidad no sean indefinidas
            if (evento.assistance !== undefined && evento.capacity !== undefined) {
                // Obtener porcentaje de asistencia
                let porcentajeAsistencia = (evento.assistance / evento.capacity) * 100

                // Buscar el elemento de menor porcentaje de asistencia
                if (porcentajeAsistencia < minPorcentajeAsistencia) {
                    minPorcentajeAsistencia = porcentajeAsistencia
                    eventoMinAsistencia = evento
                }
            }
        })

        // ENCONTRAR EL EVENTO CON LA MAYOR CAPACIDAD
        let maxCapacidad = 0
        let eventoMaxCapacidad = null

        eventos.forEach(evento => {
            // Verificar que capacidad no sea indefinida
            if (evento.capacity !== undefined) {
                // Buscar el elemento de mayor capacidad
                if (evento.capacity > maxCapacidad) {
                    maxCapacidad = evento.capacity
                    eventoMaxCapacidad = evento
                }
            }
        })

        // MOSTRAR FILA DE LA TABLA COMPLETA CON LAS TRES ESTADISTICAS
        let tableBody = document.querySelector('#events tbody')

        // Verificar que los tres elementos tengan valores
        if (eventoMaxAsistencia && eventoMinAsistencia && eventoMaxCapacidad) {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td class="text-center">The event with the highest percentage of assistance is: ${eventoMaxAsistencia.name}, with ${maxPorcentajeAsistencia.toFixed(2)} % of assistance</td>
                <td class="text-center">The event with the lowest percentage of assistance is: ${eventoMinAsistencia.name}, with ${minPorcentajeAsistencia.toFixed(2)} % of assistance</td>
                <td class="text-center">The event with the highest capacity is: ${eventoMaxCapacidad.name}, with a capacity of ${maxCapacidad}</td>
            `
            tableBody.appendChild(row)
        }


        // UPCOMINGS EVENTS BY CATEGORIA

        // Objeto para acumular las ganancias por categoría
        let gananciasPorCategoria = {}

        eventosFuturos.forEach(evento => {
            let categoria = evento.category

            // Agregar la categoría en el objeto si no existe
            if (!gananciasPorCategoria[categoria]) {
                gananciasPorCategoria[categoria] = {
                    estimadas: 0,
                    estimado: 0,
                    capacidad: 0,
                    porcentaje: 0
                }
            }

            // // Calcular ganancias estimadas si estimate no es undefined
            if (evento.estimate !== undefined) {
                let gananciasEstimadas = evento.estimate * evento.price
                gananciasPorCategoria[categoria].estimadas += gananciasEstimadas
                gananciasPorCategoria[categoria].estimado += evento.estimate
                gananciasPorCategoria[categoria].capacidad += evento.capacity
            }
        })

        // Mostrar informacion en la tabla
        for (let categoria in gananciasPorCategoria) {
            if (gananciasPorCategoria[categoria].capacidad > 0) {
                gananciasPorCategoria[categoria].porcentaje = (gananciasPorCategoria[categoria].estimado / gananciasPorCategoria[categoria].capacidad) * 100
            }

            let tableBodyUpcomings = document.querySelector('#upcomingsEvents tbody')
            const row = document.createElement('tr')
            row.innerHTML = `
                        <td>${categoria}</td>
                        <td>$ ${gananciasPorCategoria[categoria].estimadas.toLocaleString('en-US')}</td>
                        <td>${gananciasPorCategoria[categoria].porcentaje.toFixed(2)} %</td>
                        `
            tableBodyUpcomings.appendChild(row)
        }


        // PAST EVENTS BY CATEGORY

        // Objeto para acumular las ganancias por categoría
        gananciasPorCategoria = {}

        eventosPasados.forEach(evento => {
            let categoria = evento.category

            // Inicializar la categoría en el objeto si no existe
            if (!gananciasPorCategoria[categoria]) {
                gananciasPorCategoria[categoria] = {
                    asistidas: 0,
                    asistencia: 0,
                    capacidad: 0,
                    porcentaje: 0
                }
            }

            // Calcular ganancias asistidas si assistance no es undefined
            if (evento.assistance !== undefined) {
                let gananciasAsistidas = evento.assistance * evento.price
                gananciasPorCategoria[categoria].asistidas += gananciasAsistidas
                gananciasPorCategoria[categoria].asistencia += evento.assistance
                gananciasPorCategoria[categoria].capacidad += evento.capacity
            }
        })

        for (let categoria in gananciasPorCategoria) {
            // Obtener porcentaje por categorias
            if (gananciasPorCategoria[categoria].capacidad > 0) {
                gananciasPorCategoria[categoria].porcentaje = (gananciasPorCategoria[categoria].asistencia / gananciasPorCategoria[categoria].capacidad) * 100
            }

            // Mostrar informacion en la tabla
            let tableBodyPast = document.querySelector('#pastEvents tbody')
            const row = document.createElement('tr')
            row.innerHTML = `
                        <td>${categoria}</td>
                        <td>$ ${gananciasPorCategoria[categoria].asistidas.toLocaleString('en-US')}</td>
                        <td>${gananciasPorCategoria[categoria].porcentaje.toFixed(2)} %</td>
                        `
            tableBodyPast.appendChild(row)
        }
    })
    .catch(error => console.error('Error al cargar los datos:', error))